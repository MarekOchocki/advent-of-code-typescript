import * as fs from 'fs';
import { Vector2 } from '../../utils/Vector2';

class ClawMachine {
  private moveA: Vector2;
  private moveB: Vector2;
  private prizePosition: Vector2;

  constructor(inputString: string) {
    const numbers = [...inputString.matchAll(/(\d+)/g)].map(regArr => +regArr[1]);
    this.moveA = new Vector2(numbers[0], numbers[1]);
    this.moveB = new Vector2(numbers[2], numbers[3]);
    this.prizePosition = new Vector2(numbers[4], numbers[5]);
  }

  movePrize(diff: Vector2) {
    this.prizePosition = this.prizePosition.add(diff);
  }

  getMinimalCost(): number | null {
    const part1 = (this.prizePosition.y * this.moveA.x) - (this.prizePosition.x * this.moveA.y);
    const part2 = (this.moveB.y * this.moveA.x - this.moveB.x * this.moveA.y);
    const n2 = part1 / part2;
    const n1 = (this.prizePosition.x - n2 * this.moveB.x) / this.moveA.x;
    if(!Number.isInteger(n2) || !Number.isInteger(n1) || n2 < 0 || n1 < 0) {
      return null;
    }
    return n1 * 3 + n2;
  }
}

export function printSolutions13(): void {
  const input = fs.readFileSync('./app/2024/res/input13.txt').toString();
  const machines = input.split('\n\n').map(str => new ClawMachine(str));
  const costSum1 = machines.map(m => m.getMinimalCost() ?? 0).reduce((acc, val) => acc + val);
  machines.forEach(m => m.movePrize(new Vector2(10000000000000, 10000000000000)));
  const costSum2 = machines.map(m => m.getMinimalCost() ?? 0).reduce((acc, val) => acc + val);
  console.log(costSum1);
  console.log(costSum2);
}
