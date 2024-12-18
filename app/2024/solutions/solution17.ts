import * as fs from 'fs';

interface ProcessorState {
  registers: [number, number, number];
  instructionNumber: number;
}

interface Instruction {
  execute(state: ProcessorState): void;
}

function getValueOfComboOperand(operand: number, registers: [number, number, number]): number {
  if(operand <= 3) return operand;
  return registers[operand - 4];
}

class AdvInstruction implements Instruction {
  constructor(private operand: number) {}
  
  execute(state: ProcessorState): void {
    const operandValue = getValueOfComboOperand(this.operand, state.registers);
    const denominator = 2**operandValue;
    state.registers[0] = Math.floor(state.registers[0] / denominator);
    state.instructionNumber += 2;
  }
}

class BxlInstruction implements Instruction {
  constructor(private operand: number) {}
  
  execute(state: ProcessorState): void {
    state.registers[1] = this.operand ^ state.registers[1];
    state.instructionNumber += 2;
  }
}

class BstInstruction implements Instruction {
  constructor(private operand: number) {}
  
  execute(state: ProcessorState): void {
    const operandValue = getValueOfComboOperand(this.operand, state.registers);
    state.registers[1] = operandValue % 8;
    state.instructionNumber += 2;
  }
}

class JnzInstruction implements Instruction {
  constructor(private operand: number) {}
  
  execute(state: ProcessorState): void {
    if(state.registers[0] === 0) {
      state.instructionNumber += 2;
      return;
    }
    state.instructionNumber = this.operand;
  }
}

class BxcInstruction implements Instruction {
  constructor(private operand: number) {}
  
  execute(state: ProcessorState): void {
    state.registers[1] = state.registers[1] ^ state.registers[2];
    state.instructionNumber += 2;
  }
}

class OutInstruction implements Instruction {
  constructor(private operand: number, private outArray: number[]) {}
  
  execute(state: ProcessorState): void {
    const operandValue = getValueOfComboOperand(this.operand, state.registers) % 8;
    this.outArray.push(operandValue);
    state.instructionNumber += 2;
  }
}

class BdvInstruction implements Instruction {
  constructor(private operand: number) {}
  
  execute(state: ProcessorState): void {
    const operandValue = getValueOfComboOperand(this.operand, state.registers);
    const denominator = 2**operandValue;
    state.registers[1] = Math.floor(state.registers[0] / denominator);
    state.instructionNumber += 2;
  }
}

class CdvInstruction implements Instruction {
  constructor(private operand: number) {}
  
  execute(state: ProcessorState): void {
    const operandValue = getValueOfComboOperand(this.operand, state.registers);
    const denominator = 2**operandValue;
    state.registers[2] = Math.floor(state.registers[0] / denominator);
    state.instructionNumber += 2;
  }
}

class Processor {
  private readonly initialRegisters: [number, number, number];
  private state: ProcessorState;
  private outArray: number[] = [];
  private instructions: Instruction[];

  constructor(registersInputPart: string, program: number[]) {
    const numbers = [...registersInputPart.matchAll(/(-?\d+)/g)].map(regexArr => +regexArr[1]);
    this.initialRegisters = [numbers[0], numbers[1], numbers[2]];
    this.state = {
      registers: [...this.initialRegisters],
      instructionNumber: 0
    };

    this.instructions = [];
    for(let i = 0; i < program.length; i+=2) {
      this.instructions.push(this.parseInstructionAt(program, i)!);
    }
  }
  
  resetStateWithAValue(newAValue: number): void {
    this.state.registers[0] = newAValue;
    this.state.registers[1] = this.initialRegisters[1];
    this.state.registers[2] = this.initialRegisters[2];
    this.state.instructionNumber = 0;
    this.outArray.splice(0, this.outArray.length);
  }

  executeProgram() {
    let currentInstruction = this.getInstructionAtPointer();
    while(currentInstruction !== undefined) {
      currentInstruction.execute(this.state);
      currentInstruction = this.getInstructionAtPointer();
    }
  }

  getOutput(): number[] {
    return [...this.outArray];
  }

  private getInstructionAtPointer(): Instruction | undefined {
    return this.instructions[this.state.instructionNumber / 2];
  }

  private parseInstructionAt(programMemory: number[], position: number): Instruction | undefined {
    const instructionCode = programMemory[position];
    const instructionOperand = programMemory[position + 1];
    if(instructionCode === undefined || instructionOperand === undefined) return undefined;
    switch (instructionCode) {
      case 0:
        return new AdvInstruction(instructionOperand);
      case 1:
        return new BxlInstruction(instructionOperand);
      case 2:
        return new BstInstruction(instructionOperand);
      case 3:
        return new JnzInstruction(instructionOperand);
      case 4:
        return new BxcInstruction(instructionOperand);
      case 5:
        return new OutInstruction(instructionOperand, this.outArray);
      case 6:
        return new BdvInstruction(instructionOperand);
      case 7:
        return new CdvInstruction(instructionOperand);
    }
    return undefined;
  }
}


class ReverseProcessor {
  private cache = new Array<number>(2**10).fill(-1);

  constructor(program: number[]) {
    const processor = new Processor('0 0 0', program);
    for(let i = 0; i < this.cache.length; i++) {
      processor.resetStateWithAValue(i);
      processor.executeProgram();
      const output = processor.getOutput();
      this.cache[i] = output[0];
    }
  }

  getSmallestAThatProduces(output: number[]): bigint | undefined {
    const initAValues = this.findAllAValuesInCacheThatProduceWithHighestBitsSet(output.pop()!, 0n);
    const reversedOutput = [...output].reverse();
    const results = initAValues.map(potentialAValue => this.getSmallestAThatProducesWithHighestBitsSet(reversedOutput, (potentialAValue & 127n)));
    const filteredResults = results.filter(s => s !== undefined);
    filteredResults.sort((a, b) => Number(a - b));
    return filteredResults.at(0);
  }

  private getSmallestAThatProducesWithHighestBitsSet(reversedOutput: number[], highest7Bits: bigint): bigint | undefined {
    if(reversedOutput.length === 1) {
      const potentialValues = this.findAllAValuesInCacheThatProduceWithHighestBitsSet(reversedOutput[0], highest7Bits);
      return potentialValues.sort((a, b) => Number(a - b)).at(0);
    }
    const [lastElement, ...smallerReversedOutput] = reversedOutput;
    const initAValues = this.findAllAValuesInCacheThatProduceWithHighestBitsSet(lastElement, highest7Bits);
    const results = initAValues.map(potentialAValue => this.getSmallestAThatProducesWithHighestBitsSet(smallerReversedOutput, (potentialAValue & 127n)));
    const filteredResults = results.filter(s => s !== undefined);
    const fullResults = filteredResults.map(v => v + ((highest7Bits >> 4n) << (10n + BigInt((smallerReversedOutput.length - 1) * 3))));
    fullResults.sort((a, b) => Number(a - b));
    return fullResults.at(0);
  }

  private findAllAValuesInCacheThatProduceWithHighestBitsSet(outputNumber: number, highest7Bits: bigint): bigint[] {
    let result: bigint[] = [];
    for(let i = (highest7Bits << 3n); i < (highest7Bits << 3n) + 8n; i++) {
      const rotatedVal = i >> 3n;
      if(this.cache[Number(i)] === outputNumber && rotatedVal === highest7Bits) {
        result.push(BigInt(i));
      }
    }
    return result;
  }
}

function parseInput(): [string, number[]] {
  const input = fs.readFileSync('./app/2024/res/input17.txt').toString();
  const [registersInputPart, programPart] = input.split('\n\n');
  const program = programPart.split(' ')[1].split(',').map(s => +s);
  return [registersInputPart, program];
}

function printSolution17Part1(): void {
  const [registersInputPart, program] = parseInput();
  const processor = new Processor(registersInputPart, program);
  processor.executeProgram();
  const output = processor.getOutput().map(v => `${v}`).join(',');
  console.log(output);
}

function printSolution17Part2(): void {
  const [_, program] = parseInput();
  const reverseProcessor = new ReverseProcessor(program);
  console.log(Number(reverseProcessor.getSmallestAThatProduces(program)));
}

export function printSolutions17(): void {
  printSolution17Part1();
  printSolution17Part2();
}
