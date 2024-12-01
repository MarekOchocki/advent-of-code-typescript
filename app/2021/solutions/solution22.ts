import * as fs from 'fs';
import { Vector3 } from '../../utils/Vector3';

class Cuboid {
  constructor(public topLeftBack: Vector3, public bottomRightFront: Vector3) { }

  static fromString(str: string): Cuboid {
    const [xRange, yRange, zRange] = str.split(',');
    const [xLow, xHigh] = xRange.slice(2).split('..');
    const [yLow, yHigh] = yRange.slice(2).split('..');
    const [zLow, zHigh] = zRange.slice(2).split('..');
    
    const vec1 = new Vector3(+xLow, +yLow, +zLow);
    const vec2 = new Vector3(+xHigh, +yHigh, +zHigh);
    return new Cuboid(vec1, vec2);
  }

  toString(): string {
    const xPart = `x=${this.topLeftBack.x}..${this.bottomRightFront.x}`;
    const yPart = `y=${this.topLeftBack.y}..${this.bottomRightFront.y}`;
    const zPart = `z=${this.topLeftBack.z}..${this.bottomRightFront.z}`;
    return `${xPart},${yPart},${zPart}`;
  }

  getIntersection(other: Cuboid): Cuboid | null {
    const intersectionTopLeftBack = new Vector3(
      Math.max(this.topLeftBack.x, other.topLeftBack.x),
      Math.max(this.topLeftBack.y, other.topLeftBack.y),
      Math.max(this.topLeftBack.z, other.topLeftBack.z),
    );
    
    const intersectionBottomRightFront = new Vector3(
      Math.min(this.bottomRightFront.x, other.bottomRightFront.x),
      Math.min(this.bottomRightFront.y, other.bottomRightFront.y),
      Math.min(this.bottomRightFront.z, other.bottomRightFront.z),
    );

    if (intersectionBottomRightFront.x - intersectionTopLeftBack.x >= 0 &&
      intersectionBottomRightFront.y - intersectionTopLeftBack.y >= 0 &&
      intersectionBottomRightFront.z - intersectionTopLeftBack.z >= 0) {
        return new Cuboid(intersectionTopLeftBack, intersectionBottomRightFront);
    }
    return null;
  }

  getVolume(): number {
    const x = this.bottomRightFront.x - this.topLeftBack.x + 1;
    const y = this.bottomRightFront.y - this.topLeftBack.y + 1;
    const z = this.bottomRightFront.z - this.topLeftBack.z + 1;
    return x * y * z;
  }
}

class Instruction {
  constructor(public mode: 'on' | 'off', public cuboid: Cuboid) {

  }

  static fromString(line: string): Instruction {
    const [mode, cuboidPart] = line.split(' ');
    const cuboid = Cuboid.fromString(cuboidPart);
    return new Instruction(mode as 'on' | 'off', cuboid);
  }
}

function getSumOfVolume(instructions: Instruction[]): number {
  let sum = 0;
  for(let i = instructions.length - 1; i >= 0; i--) {
    const instruction = instructions[i];
    if(instruction.mode === 'on') {
      let intersections: Instruction[] = [];

      for(let j = instructions.length - 1; j > i; j--) {
        const potentialIntersection = instruction.cuboid.getIntersection(instructions[j].cuboid);
        if(potentialIntersection) {
          intersections.push(new Instruction('on', potentialIntersection));
        }
      }
      sum += instruction.cuboid.getVolume();
      sum -= getSumOfVolume(intersections);
    }
  }
  return sum;
}

function parseInput(): Instruction[] {
  const inputContent = fs.readFileSync('./app/2021/res/input22.txt').toString();
  return inputContent.split("\n").map(line => Instruction.fromString(line));
}

function printSolution22Part1() {
  const instructions = parseInput();
  const areaCuboid = Cuboid.fromString('x=-50..50,y=-50..50,z=-50..50');
  const instructionsInArea = instructions.map(instruction => {
    const intersectionCuboid = instruction.cuboid.getIntersection(areaCuboid);
    if (intersectionCuboid === null)
      return null;
    return new Instruction(instruction.mode, intersectionCuboid);
  });
  const notNullInstructions = instructionsInArea.filter(instructions => instructions !== null) as Instruction[];
  console.log(getSumOfVolume(notNullInstructions));
}

function printSolution22Part2() {
  const instructions = parseInput();
  console.log(getSumOfVolume(instructions));
}


export function printSolutions22(): void {
  printSolution22Part1();
  printSolution22Part2();
}
