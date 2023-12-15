import * as fs from 'fs';

function makeHash(str: string): number {
  let currentValue = 0;
  for(let i = 0; i < str.length; i++) {
    currentValue += str.charCodeAt(i);
    currentValue *= 17;
    currentValue %= 256;
  }
  return currentValue;
}

class Lens {
  constructor(public name: string, public length: number) { }

  static fromAddStep(stepStr: string): Lens {
    const parts = stepStr.split("=");
    const label = parts[0];
    const length = +parts[1];
    return new Lens(label, length);
  }
}

class Box {
  private lenses: Lens[] = [];

  public addLens(lens: Lens) {
    const oldLensIndex = this.lenses.findIndex(l => lens.name === l.name);
    if(oldLensIndex !== -1) {
      this.lenses[oldLensIndex].length = lens.length;
      return;
    }
    this.lenses.push(lens);
  }

  public removeLens(name: string) {
    this.lenses = this.lenses.filter(l => l.name !== name);
  }

  public getFocusingPower(): number {
    const powers = this.lenses.map((lens, i) => lens.length * (i+1));
    return powers.reduce((acc, n) => acc + n, 0);
  }
}

function performStep(boxes: Box[], stepStr: string): void {
  if(stepStr.includes("-")) {
    const label = stepStr.split("-")[0];
    const hash = makeHash(label);
    boxes[hash].removeLens(label);
  } else {
    const lens = Lens.fromAddStep(stepStr);
    const hash = makeHash(lens.name);
    boxes[hash].addLens(lens);
  }
}

function printSolution15Part1() {
  const inputContent = fs.readFileSync('./app/res/week3/input15.txt').toString();
  const steps = inputContent.split("\n")[0].split(",");
  const hashes = steps.map(s => makeHash(s));
  const result = hashes.reduce((acc, n) => acc + n, 0);
  console.log(result);
}

function printSolution15Part2() {
  const inputContent = fs.readFileSync('./app/res/week3/input15.txt').toString();
  const steps = inputContent.split("\n")[0].split(",");
  const boxes = new Array(256).fill(1).map(_ => new Box());
  steps.forEach(step => performStep(boxes, step));
  const powers = boxes.map((box, i) => box.getFocusingPower() * (i+1));
  const result = powers.reduce((acc, n) => acc + n, 0);
  console.log(result);
}

export function printSolutions15() {
  printSolution15Part1();
  printSolution15Part2();
}