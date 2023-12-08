import * as fs from 'fs';

class LeastCommonMultipleCalculator {
  getLeastCommonMultipleForArray(numbers: number[]): number {
    let currentLCM = this.getLeastCommonMultiple(numbers[0], numbers[1]);
    for(let i = 2; i < numbers.length; i++) {
      currentLCM = this.getLeastCommonMultiple(currentLCM, numbers[i]);
    }
    return currentLCM;
  }

  getLeastCommonMultiple(first: number, second: number): number {
    const gcd = this.getGreatestCommonDivisor(first, second);
    return (first*second)/gcd;
  }

  getGreatestCommonDivisor(a: number, b: number): number {
    while(b !== 0) {
      let tmp = b;
      b = a % b;
      a = tmp;
    }
    return a;
  }
}

class Node {
  public name = "";
  public leftName = "";
  public rightName = "";
  public leftDist = 0;
  public rightDist = 0;

  public static fromLine(line: string): Node {
    const result = new Node();
    const nameAndPair = line.split(" = (");
    result.name = nameAndPair[0];
    const pairNodes = nameAndPair[1].substring(0, nameAndPair[1].length - 1).split(", ");
    result.leftName = pairNodes[0];
    result.rightName = pairNodes[1];
    return result;
  }

  public updateLeftDist(newDist: number): void {
    this.leftDist = newDist;
  }

  public updateRightDist(newDist: number): void {
    this.rightDist = newDist;
  }
}

class ParsedInput {
  public moveSequence: string = "";
  public nodes: Node[] = [];
  public nameToPosition = new Map<string, number>();

  public currentDirectionIndex = 0;

  constructor() {
    const inputContent = fs.readFileSync('./app/res/week2/input8.txt').toString();
    let inputLines = inputContent.split('\n');
    this.moveSequence =  inputLines[0];
    this.makeNodes(inputLines);
  }

  public resetDirectionCounting(): void {
    this.currentDirectionIndex = 0;
  }

  public getNextDirection(): string {
    const direction = this.moveSequence[this.currentDirectionIndex];
    this.currentDirectionIndex++;
    if(this.currentDirectionIndex >= this.moveSequence.length) {
      this.resetDirectionCounting();
    }
    return direction;
  }

  private makeNodes(inputLines: string[]): void {
    inputLines = inputLines.slice(2);
    this.nodes = inputLines.map(line => Node.fromLine(line));
    this.nodes.forEach((node, i) => {
      this.nameToPosition.set(node.name, i);
    });
    
    this.nodes.forEach((node, i) => {
      const leftPos = this.nameToPosition.get(node.leftName) as number;
      const rightPos = this.nameToPosition.get(node.rightName) as number;
      node.updateLeftDist(leftPos - i);
      node.updateRightDist(rightPos - i);
    });
  }
}

function getStepsFromNodeToEnd(input: ParsedInput, nodeIndex: number): number {
  input.resetDirectionCounting();
  let currentNodeIndex = nodeIndex;
  let currentNode = input.nodes[currentNodeIndex];
  let steps = 0;
  do {
    const direction = input.getNextDirection();
    const diff = direction === "R" ? currentNode.rightDist : currentNode.leftDist;
    currentNodeIndex += diff;
    currentNode = input.nodes[currentNodeIndex];
    steps++;
  } while(!currentNode.name.endsWith("Z"))
  return steps;
}

function printSolution8Part1() {
  const input = new ParsedInput();
  let currentNodeIndex = input.nameToPosition.get("AAA") as number;
  let currentNode = input.nodes[currentNodeIndex];
  let steps = 0;
  while(currentNode.name !== "ZZZ") {
    const direction = input.getNextDirection();
    const diff = direction === "R" ? currentNode.rightDist : currentNode.leftDist;
    currentNodeIndex += diff;
    currentNode = input.nodes[currentNodeIndex];
    steps++;
  }
  console.log(steps);
}

/*
  This solution works only because the input data have some untold assumptions:
  - every ghost visits only one node with name that ends with 'Z' (in X steps)
  - after reaching the end node it cycles through nodes and ends up in the same node in exactly X steps
  - for every ghost the X is divisible by the length of the movement sequence ("LRLRL...")
*/
function printSolution8Part2() {
  const input = new ParsedInput();
  let ghostStartNodeIndexes: number[] = [];
  input.nodes.forEach((node, i) => {
    if(node.name.endsWith("A")) {
      ghostStartNodeIndexes.push(i);
    }
  });
  let steps = ghostStartNodeIndexes.map(index => getStepsFromNodeToEnd(input, index));
  const calculator = new LeastCommonMultipleCalculator();
  const result = calculator.getLeastCommonMultipleForArray(steps);
  console.log(result);
}

export function printSolutions8() {
  printSolution8Part1();
  printSolution8Part2();
}