import * as fs from 'fs';

type RangeRuleDestination = {range: MachinePartRange, destination: string | undefined};
type RangeDestination = {range: MachinePartRange, destination: string};

class WorkflowRule {
  compareChar: "<" | ">" = ">";
  key: "x" | "m" | "a" | "s" = "x";
  value = 0;
  shouldDoComparison = true;
  destination = "";

  constructor(ruleString: string) {
    if(!ruleString.includes(":")) {
      this.destination = ruleString;
      this.shouldDoComparison = false;
      return;
    }

    const [comparisonString, destination] = ruleString.split(":");
    this.destination = destination;
    this.compareChar = comparisonString.includes(">") ? ">" : "<";
    const [key, value] = comparisonString.split(this.compareChar);
    this.key = key as ("x" | "m" | "a" | "s");
    this.value = +value;
  }

  getDestination(part: MachinePart): string | undefined {
    if(!this.shouldDoComparison) {
      return this.destination;
    }

    if(this.compareChar === "<")
      return part[this.key] < this.value ? this.destination : undefined;
    return part[this.key] > this.value ? this.destination : undefined;
  }

  getDestinationsForRange(range: MachinePartRange): RangeRuleDestination[] {
    if(!this.shouldDoComparison) {
      return [{range, destination: this.destination}];
    }
    const partValueRange = range[this.key];
    const result: {range: MachinePartRange, destination: string | undefined}[] = [];

    if(this.compareChar === "<") {
      const [lower, higher] = partValueRange.splitLessThan(this.value);
      if(lower !== undefined) {
        let lowerMachineRange = range.copy();
        lowerMachineRange[this.key] = lower; 
        result.push({range: lowerMachineRange, destination: this.destination});
      }
      if(higher !== undefined) {
        let higherMachineRange = range.copy();
        higherMachineRange[this.key] = higher; 
        result.push({range: higherMachineRange, destination: undefined});
      }
      return result;
    }

    const [lower, higher] = partValueRange.splitMoreThan(this.value);
    if(lower !== undefined) {
      let lowerMachineRange = range.copy();
      lowerMachineRange[this.key] = lower; 
      result.push({range: lowerMachineRange, destination: undefined});
    }
    if(higher !== undefined) {
      let higherMachineRange = range.copy();
      higherMachineRange[this.key] = higher; 
      result.push({range: higherMachineRange, destination: this.destination});
    }
    return result;
  }
}

class Workflow {
  name: string;
  rules: WorkflowRule[];

  constructor(inputLine: string) {
    this.name = inputLine.split("{")[0];
    const rulesString = inputLine.substring(this.name.length + 1, inputLine.length-1).split(",");
    this.rules = rulesString.map(r => new WorkflowRule(r));
  }

  getDestination(part: MachinePart): string {
    let result: string | undefined = undefined;
    let i = 0;
    while(result === undefined) {
      result = this.rules[i].getDestination(part);
      i++;
    }
    return result;
  }
  
  getDestinationsForRange(range: MachinePartRange): RangeDestination[] {
    let result: RangeDestination[] = [];

    let currentRange: MachinePartRange | undefined = range;
    this.rules.forEach(rule => {
      if(currentRange === undefined) return;
      const destinations = rule.getDestinationsForRange(currentRange);
      currentRange = undefined;
      destinations.forEach(dest => {
        if(dest.destination === undefined) {
          currentRange = dest.range;
        } else {
          result.push({range: dest.range, destination: dest.destination});
        }
      });
    })
    return result;
  }
}

class MachinePart {
  x: number;
  m: number;
  a: number;
  s: number;

  constructor(inputLine: string) {
    const jsonString = inputLine.replace(/([xmas])=/g, '"$1":');
    const object = JSON.parse(jsonString);
    this.x = object.x;
    this.m = object.m;
    this.a = object.a;
    this.s = object.s;
  }

  getSumOfRatings(): number {
    return this.x + this.m + this.a + this.s;
  }
}

class Range {
  constructor(public min: number, public max: number) { }

  splitLessThan(value: number): (Range | undefined)[] {
    if(this.max < value)
      return [new Range(this.min, this.max), undefined];
    if(value <= this.min)
      return [undefined, new Range(this.min, this.max)];
    return [
      new Range(this.min, value - 1),
      new Range(value, this.max)
    ];
  }

  splitMoreThan(value: number): (Range | undefined)[] {
    if(this.min > value)
      return [undefined, new Range(this.min, this.max)];
    if(value >= this.max)
      return [new Range(this.min, this.max), undefined];
    return [
      new Range(this.min, value),
      new Range(value + 1, this.max)
    ];
  }

  getLength(): number {
    return this.max - this.min + 1;
  }
}

class MachinePartRange {
  x: Range;
  m: Range;
  a: Range;
  s: Range;

  constructor() {
    this.x = new Range(1, 4000);
    this.m = new Range(1, 4000);
    this.a = new Range(1, 4000);
    this.s = new Range(1, 4000);
  }

  copy(): MachinePartRange {
    const result = new MachinePartRange();
    result.x = new Range(this.x.min, this.x.max);
    result.m = new Range(this.m.min, this.m.max);
    result.a = new Range(this.a.min, this.a.max);
    result.s = new Range(this.s.min, this.s.max);
    return result;
  }

  getAllCombinations(): number {
    return this.x.getLength() * this.m.getLength() * this.a.getLength() * this.s.getLength();
  }
}

class ParsedInput {
  workflows: Workflow[] = [];
  parts: MachinePart[] = [];
  ratingSumOfAcceptedParts = 0;
  acceptedCombinationsNumber = 0;

  constructor() {
    const inputContent = fs.readFileSync('./app/2023/res/input19.txt').toString();
    const [workflowsInput, partsInput] = inputContent.split("\n\n");
    this.parts = partsInput.split("\n").map(line => new MachinePart(line));
    this.workflows = workflowsInput.split("\n").map(line => new Workflow(line));
    this.ratingSumOfAcceptedParts = this.calculateRatingSumOfAcceptedParts();
    this.acceptedCombinationsNumber = this.calculateAcceptedCombinationsNumber(new MachinePartRange(), "in");
  }

  private calculateRatingSumOfAcceptedParts(): number {
    const ratings = this.parts.map(part => this.isAccepted(part) ? part.getSumOfRatings() : 0);
    return ratings.reduce((acc, r) => acc + r);
  }

  private calculateAcceptedCombinationsNumber(range: MachinePartRange, workflowName: string): number {
    if(workflowName === "A") return range.getAllCombinations();
    if(workflowName === "R") return 0;
    const workflow = this.workflows.find(w => w.name === workflowName);
    if(workflow === undefined) throw "something went wrong";
    const destinations = workflow.getDestinationsForRange(range);
    const combinationsPerDestination = destinations.map(d => this.calculateAcceptedCombinationsNumber(d.range, d.destination));
    return combinationsPerDestination.reduce((acc, c) => acc + c);
  }

  private isAccepted(part: MachinePart): boolean {
    let currentWorkflowName = "in";
    let currentWorkflow = this.workflows.find(w => w.name === currentWorkflowName);
    while(currentWorkflowName !== "A" && currentWorkflowName !== "R" && currentWorkflow !== undefined) {
      currentWorkflowName = currentWorkflow.getDestination(part);
      currentWorkflow = this.workflows.find(w => w.name === currentWorkflowName);
    }
    return currentWorkflowName === "A";
  }
}

export function printSolutions19() {
  const input = new ParsedInput();
  console.log(input.ratingSumOfAcceptedParts);
  console.log(input.acceptedCombinationsNumber);
}