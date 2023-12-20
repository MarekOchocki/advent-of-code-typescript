import * as fs from 'fs';
import { LeastCommonMultipleCalculator } from '../utils/LeastCommonMultipleCalculator';

enum PulseType {
  Low,
  High
}

enum ModuleType {
  Broadcaster,
  FlipFlop,
  Conjunction
}

class PulsesCounter {
  public lowPulsesSent = 0;
  public highPulsesSent = 0;
}

type ModulePulse = {from: string, to: string, pulse: PulseType};

interface Module {
  getName(): string;
  getType(): ModuleType;
  receivePulse(inputName: string, pulse: PulseType): ModulePulse[];
  getNumberOfLowPulses(): number;
  getNumberOfHighPulses(): number;
  resetPulsesCounter(): void;
}

class ConjunctionModule implements Module {
  private pulsesCounter = new PulsesCounter();
  private inputs = new Map<string, PulseType>();

  constructor(public name: string, private outputs: string[]) { }

  addInput(name: string): void {
    this.inputs.set(name, PulseType.Low);
  }

  getName(): string {
    return this.name;
  }

  getType(): ModuleType {
    return ModuleType.Conjunction;
  }

  receivePulse(inputName: string, pulse: PulseType): ModulePulse[] {
    this.inputs.set(inputName, pulse);
    let isEveryInputHigh = true;
    this.inputs.forEach(v => {if(v === PulseType.Low) isEveryInputHigh = false; });

    if(isEveryInputHigh) {
      this.pulsesCounter.lowPulsesSent += this.outputs.length;
      return this.outputs.map(to => ({from: this.getName(), to, pulse: PulseType.Low}));
    }
    this.pulsesCounter.highPulsesSent += this.outputs.length;
    return this.outputs.map(to => ({from: this.getName(), to, pulse: PulseType.High}));
  }

  getNumberOfLowPulses(): number {
    return this.pulsesCounter.lowPulsesSent;
  }

  getNumberOfHighPulses(): number {
    return this.pulsesCounter.highPulsesSent;
  }

  resetPulsesCounter(): void {
    this.pulsesCounter = new PulsesCounter();
  }
}

class FlipFlopModule implements Module {
  private pulsesCounter = new PulsesCounter();
  private isOn = false;

  constructor(public name: string, private outputs: string[]) { }

  getType(): ModuleType {
    return ModuleType.FlipFlop;
  }

  getName(): string {
    return this.name;
  }

  receivePulse(inputName: string, pulse: PulseType): ModulePulse[] {
    if(pulse === PulseType.High) { return []; }
    this.isOn = !this.isOn;
    if(this.isOn) {
      this.pulsesCounter.highPulsesSent += this.outputs.length;
      return this.outputs.map(to => ({from: this.getName(), to, pulse: PulseType.High}));
    }
    this.pulsesCounter.lowPulsesSent += this.outputs.length;
    return this.outputs.map(to => ({from: this.getName(), to, pulse: PulseType.Low}));
  }

  getNumberOfLowPulses(): number {
    return this.pulsesCounter.lowPulsesSent;
  }

  getNumberOfHighPulses(): number {
    return this.pulsesCounter.highPulsesSent;
  }

  resetPulsesCounter(): void {
    this.pulsesCounter = new PulsesCounter();
  }
}

class BroadcastModule implements Module {
  private pulsesCounter = new PulsesCounter();
  private name = "broadcaster";

  constructor(private outputs: string[]) { }

  getType(): ModuleType {
    return ModuleType.Broadcaster;
  }

  getName(): string {
    return this.name;
  }

  receivePulse(inputName: string, pulse: PulseType): ModulePulse[] {
    // assumption: only button can send pulse to broadcaster so it's always low
    this.pulsesCounter.lowPulsesSent += this.outputs.length;
    return this.outputs.map(to => ({from: this.getName(), to, pulse: PulseType.Low}));
  }

  getNumberOfLowPulses(): number {
    return this.pulsesCounter.lowPulsesSent;
  }

  getNumberOfHighPulses(): number {
    return this.pulsesCounter.highPulsesSent;
  }

  resetPulsesCounter(): void {
    this.pulsesCounter = new PulsesCounter();
  }
}

class ModuleFactory {
  static flipflopsCount = 0;
  static conjunctionsCount = 0;

  static fromInputString(input: string): Module[] {
    const inputLines = input.split("\n");
    const modules = inputLines.map(line => ModuleFactory.fromInputLine(line));
    inputLines.forEach(line => ModuleFactory.setUpInputsFromLine(line, modules));
    return modules;
  }

  static setUpInputsFromLine(line: string, modules: Module[]): void {
    const [inputPart, outputsPart] = line.split(" -> ");
    const outputs = outputsPart.split(", ");
    let inputName = inputPart;
    if(inputPart[0] === "%" || inputPart[0] === "&") {
      inputName = inputPart.slice(1);
    }

    outputs.forEach(outputName => {
      const module = modules.find(m => m.getName() === outputName);
      if(module === undefined) {
        return;
      }
      if(ModuleFactory.isConjunctionModule(module)) {
        module.addInput(inputName);
      }
    });
  }

  private static fromInputLine(line: string): Module {
    const [inputPart, outputsPart] = line.split(" -> ");
    const outputs = outputsPart.split(", ");
    if(inputPart[0] === "%") {
      return new FlipFlopModule(inputPart.slice(1), outputs);
    }
    if(inputPart[0] === "&") {
      return new ConjunctionModule(inputPart.slice(1), outputs);
    }
    return new BroadcastModule(outputs);
  }

  private static isConjunctionModule(module: Module): module is ConjunctionModule {
    return module.getType() === ModuleType.Conjunction;
  }
}

class ParsedInput {
  modules: Module[] = [];
  private buttonPresses = 0;

  constructor() {
    const inputContent = fs.readFileSync('./app/res/week3/input20.txt').toString();
    this.modules = ModuleFactory.fromInputString(inputContent);
  }

  public getPulseCount(): PulsesCounter {
    const result = new PulsesCounter();
    this.modules.forEach(module => {
      result.lowPulsesSent += module.getNumberOfLowPulses();
      result.highPulsesSent += module.getNumberOfHighPulses();
    })
    result.lowPulsesSent += this.buttonPresses;
    return result;
  }

  public calculateCycles(): number[] {
    let lmCycle = 0;
    let dbCycle = 0;
    let dhCycle = 0;
    let sgCycle = 0;

    let currentModules: ModulePulse[] = [{from: "button", to: "broadcaster", pulse: PulseType.Low}];
    this.buttonPresses++;

    while(lmCycle === 0 || dbCycle === 0 || dhCycle === 0 || sgCycle === 0) {
      const modulePulse = currentModules.splice(0, 1)[0];
      if(modulePulse.to === "lm" && modulePulse.pulse === PulseType.Low && lmCycle === 0) {
        lmCycle = this.buttonPresses;
      }
      if(modulePulse.to === "db" && modulePulse.pulse === PulseType.Low && dbCycle === 0) {
        dbCycle = this.buttonPresses;
      }
      if(modulePulse.to === "dh" && modulePulse.pulse === PulseType.Low && dhCycle === 0) {
        dhCycle = this.buttonPresses;
      }
      if(modulePulse.to === "sg" && modulePulse.pulse === PulseType.Low && sgCycle === 0) {
        sgCycle = this.buttonPresses
      }
      currentModules.push(...this.sendPulseTo(modulePulse));
      if(currentModules.length === 0) {
        currentModules = [{from: "button", to: "broadcaster", pulse: PulseType.Low}];
        this.buttonPresses++;
      }
    }

    return [lmCycle, dbCycle, dhCycle, sgCycle];
  }

  public pressButton(): void {
    let currentModules: ModulePulse[] = [{from: "button", to: "broadcaster", pulse: PulseType.Low}];
    this.buttonPresses++;

    while(currentModules.length !== 0) {
      const modulePulse = currentModules.splice(0, 1)[0];
      currentModules.push(...this.sendPulseTo(modulePulse));
    }
  }

  private sendPulseTo(pulse: ModulePulse): ModulePulse[] {
    const module = this.modules.find(m => m.getName() === pulse.to);
    if(!module) {
      return [];
    }
    return module.receivePulse(pulse.from, pulse.pulse);
  }
}

function printSolution20Part1() {
  const input = new ParsedInput();
  for(let i = 0; i < 1000; i++) {
    input.pressButton();
  }
  const counter = input.getPulseCount();
  console.log(counter.lowPulsesSent * counter.highPulsesSent);
}

function printSolution20Part2() {
  const input = new ParsedInput();
  const cycles = input.calculateCycles();
  const calculator = new LeastCommonMultipleCalculator();
  const result = calculator.getLeastCommonMultipleForArray(cycles);
  console.log(result);
}

export function printSolutions20() {
  printSolution20Part1();
  printSolution20Part2();
}
