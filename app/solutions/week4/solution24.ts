import * as fs from 'fs';
import { Vector2 } from '../utils/Vector2';
import { Vector3 } from '../utils/Vector3';
const nerdamer = require('nerdamer/all.min');

function areTheSame(a: number, b: number) {
  return Math.abs(a - b) < 0.000001;
}

class HailStone {
  private collisionXYPoints: Vector2[] = [];

  constructor(public position: Vector3, public velocity: Vector3) {

  }

  isCollisionWithinTestArea(other: HailStone): boolean {
    const intersetionPoint = this.getIntersetionXY(other);
    if(intersetionPoint === null) {
      return false;
    }
    if(this.getTimeAtX(intersetionPoint.x) < 0 || other.getTimeAtX(intersetionPoint.x) < 0) {
      return false;
    }
    

    if(intersetionPoint.x < 200000000000000 || intersetionPoint.x > 400000000000000) {
      return false;
    }
    if(intersetionPoint.y < 200000000000000 || intersetionPoint.y > 400000000000000) {
      return false;
    }
    return true;
  }

  private getTimeAtX(x: number): number {
    // x(t) = Vx * t + x0
    // t = (x(t) - x0) / Vx
    return (x - this.position.x) / this.velocity.x;
  }

  private getIntersetionXY(other: HailStone): Vector2 | null {
    /*
    y = ax + b
    a = Vy / Vx
    b = y - ax
    */
    if(this.velocity.x === 0 || other.velocity.x === 0) {
      throw 'unexpected 0 velocity coord';
    }
    const a = this.velocity.y / this.velocity.x;
    const b = this.position.y - a * this.position.x;

    const otherA = other.velocity.y / other.velocity.x;
    const otherB = other.position.y - otherA * other.position.x;
    if(areTheSame(a, otherA)) {
      return null;
    }

    const x = (otherB - b) / (a - otherA);
    const y = a*x + b;
    return new Vector2(x, y);

    /*
    y = a1x + b1
    y = a2x + b2
    a1x +b1 = a2x + b2
    x(a1-a2) = b2 - b1
    x = (b2 - b1) / (a1 - a2)
    y = a1x + b1
    */
  }


  // old, too much restrictions
  private getIntersetionXYOld(other: HailStone): Vector2 | null {
    /*
    x(t) = x'(t)
    x(t) = at + x0
    x'(t) = a't + x0'
    t = ?
    at + x0 - a't - x0' = 0
    t(a - a') = x0' - x0
    t = (x0' - x0) / (a - a')
    */
    const divisor = this.velocity.x - other.velocity.x;
    if(divisor === 0) {
      return null;
    }
    const t = (other.position.x - this.position.x) / divisor;
    if(t < 0) {
      return null;
    }
    const yAtT = this.position.y + this.velocity.y * t;
    const otherYAtT = other.position.y + other.velocity.y * t;
    if(yAtT !== otherYAtT) {
      return null;
    }
    const xAtT = this.position.x + this.velocity.x * t;
    return new Vector2(xAtT, yAtT);
  }

  static fromLine(inputLine: string): HailStone {
    const [ positionStr, velocityStr] = inputLine.split(' @ ');
    const positionValues = positionStr.split(', ').map(s => +s);
    const velocityValues = velocityStr.split(', ').map(s => +s);
    const position = new Vector3(positionValues[0], positionValues[1], positionValues[2]);
    const velocity = new Vector3(velocityValues[0], velocityValues[1], velocityValues[2]);
    return new HailStone(position, velocity);
  }
}

function parseInput(): HailStone[] {
  const inputContent = fs.readFileSync('./app/res/week4/input24.txt').toString().split('\n');
  const stones = inputContent.map(line => HailStone.fromLine(line));
  return stones;
}

function printSolution24Part1(): void {
  const stones = parseInput();
  let sumOfIntersetions = 0;
  for(let i = 0; i < stones.length; i++) {
    for(let j = i + 1; j < stones.length; j++) {
      sumOfIntersetions += stones[i].isCollisionWithinTestArea(stones[j]) ? 1 : 0;
    }
  }
  console.log(sumOfIntersetions);
}

function printSolution24Part2(): void {
  const stones = parseInput();
  /*
  x(t) = Vx * t + x0

  x(t) = x1(t) .
  y(t) = y1(t) .
  z(t) = z1(t) .
  x(t2) = x2(t2) .
  y(t2) = y2(t2)
  z(t2) = z2(t2)
  x(t3) = x2(t3) .
  y(t3) = y2(t3)
  z(t3) = z2(t3)

  ...

  t = (xi1 - xi) / (Vx - Vx1)
  t2 = (xi2 - xi) / (Vx - Vx2)
  t3 = (xi3 - xi) / (Vx - Vx3)
  Vy = Vy1 + yi1 / t - yi / t
  Vz = Vz1 + zi1 / t - zi / t

  1. Vy * t3 + yi = Vy3 * t3 + yi3
  2. Vz * t2 + zi = Vz2 * t2 + zi2
  3. Vz * t3 + zi = Vz3 * t3 + zi3

  Vx = ((Vy2 - Vy) * (xi2 - xi)) / (yi - yi2) + Vx2



  Vy * (xi3 - xi) / (Vx - Vx3) + yi - Vy3 * (xi3 - xi) / (Vx - Vx3) - yi3 = 0

  xi =
  yi =
  zi =


  
  */
  // let ex = new Expression('x').multiply(2).add('y');
  // const equation = parse('a * b + a * x = 5') as Equation;
  // console.log(equation.solveFor('x')?.toString());

  const equations = [
    "Vx * t + xi = Vx1 * t + xi1",
    "Vy * t + yi = Vy1 * t + yi1",
    "Vz * t + zi = Vz1 * t + zi1",

    "Vx * t2 + xi = Vx2 * t2 + xi2",
    "Vy * t2 + yi = Vy2 * t2 + yi2",
    "Vz * t2 + zi = Vz2 * t2 + zi2",
    
    "Vx * t3 + xi = Vx3 * t3 + xi3",
    "Vy * t3 + yi = Vy3 * t3 + yi3",
    "Vz * t3 + zi = Vz3 * t3 + zi3"
  ];

  const variables = [
    "Vx", "Vy", "Vz", "xi", "yi", "zi"
  ];

  let nerdamerStr = `solveEquations([
    a * t + x = Vx1 * t + xi1,
    b * t + y = Vy1 * t + yi1,
    c * t + z = Vz1 * t + zi1,

    a * t2 + x = Vx2 * t2 + xi2,
    b * t2 + y = Vy2 * t2 + yi2,
    c * t2 + z = Vz2 * t2 + zi2,
    
    a * t3 + x = Vx3 * t3 + xi3,
    b * t3 + y = Vy3 * t3 + yi3,
    c * t3 + z = Vz3 * t3 + zi3
  ],
  [
    a, b, c, x, y, z, t, t2, t3
  ]
  )`;

  nerdamerStr = nerdamerStr.replace('Vx1', `${stones[1].velocity.x}`);
  nerdamerStr = nerdamerStr.replace('Vx2', `${stones[2].velocity.x}`);
  nerdamerStr = nerdamerStr.replace('Vx3', `${stones[3].velocity.x}`);
  nerdamerStr = nerdamerStr.replace('Vy1', `${stones[1].velocity.y}`);
  nerdamerStr = nerdamerStr.replace('Vy2', `(${stones[2].velocity.y})`);
  nerdamerStr = nerdamerStr.replace('Vy3', `${stones[3].velocity.y}`);
  nerdamerStr = nerdamerStr.replace('Vz1', `(${stones[1].velocity.z})`);
  nerdamerStr = nerdamerStr.replace('Vz2', `(${stones[2].velocity.z})`);
  nerdamerStr = nerdamerStr.replace('Vz3', `${stones[3].velocity.z}`);
  
  nerdamerStr = nerdamerStr.replace('xi1', `${stones[1].position.x}`);
  nerdamerStr = nerdamerStr.replace('xi2', `${stones[2].position.x}`);
  nerdamerStr = nerdamerStr.replace('xi3', `${stones[3].position.x}`);
  nerdamerStr = nerdamerStr.replace('yi1', `${stones[1].position.y}`);
  nerdamerStr = nerdamerStr.replace('yi2', `${stones[2].position.y}`);
  nerdamerStr = nerdamerStr.replace('yi3', `${stones[3].position.y}`);
  nerdamerStr = nerdamerStr.replace('zi1', `${stones[1].position.z}`);
  nerdamerStr = nerdamerStr.replace('zi2', `${stones[2].position.z}`);
  nerdamerStr = nerdamerStr.replace('zi3', `${stones[3].position.z}`);

  console.log(nerdamerStr);

  nerdamer.set('SOLUTIONS_AS_OBJECT' as any, true);
  let sol = nerdamer(nerdamerStr);

  console.log(sol);
}

export function printSolutions24(): void {
  // TODO: not completed
  printSolution24Part1();
  printSolution24Part2();
}