import * as fs from 'fs';
import { Matrix } from '../../utils/Matrix';
import { Vector2 } from '../../utils/Vector2';

class Solver {
  private readonly diagonalDirections: Vector2[] = [
    new Vector2(1, 1),
    new Vector2(1, -1),
    new Vector2(-1, -1),
    new Vector2(-1, 1)
  ];

  private readonly allDirections: Vector2[] = [
    new Vector2(0, 1),
    new Vector2(1, 0),
    new Vector2(0, -1),
    new Vector2(-1, 0),
    ...this.diagonalDirections
  ];

  private grid: Matrix<string>;

  constructor() {
    const input = fs.readFileSync('./app/2024/res/input4.txt').toString();
    this.grid = Matrix.fromString(input, c => c);
  }

  public getNumberOfWords(word: string): number {
    return this.grid.reduce((acc, _, position) => acc + this.getNumberOfWordsStartingAt(position, word), 0);
  }

  public getNumberOfWordCrosses(word: string): number {
    return this.grid.reduce((acc, _, position) => acc + (this.isPositionAMiddleOfWordCross(position, word) ? 1 : 0), 0);
  }

  private getNumberOfWordsStartingAt(position: Vector2, word: string): number {
    return this.allDirections.reduce((acc, direction) => acc + (this.isWordInDirection(position, direction, word) ? 1 : 0), 0);
  }

  private isPositionAMiddleOfWordCross(position: Vector2, word: string): boolean {
    let sum = this.diagonalDirections.reduce((acc, direction) => {
      return acc + (this.isWordInDirection(position.add(direction), direction.reverse(), word) ? 1 : 0)
    }, 0);
    return sum === 2;
  }

  private isWordInDirection(startPosition: Vector2, direction: Vector2, word: string): boolean {
    let currentPosition = startPosition;
    for(let i = 0; i < word.length; i++) {
      if(this.grid.get(currentPosition) !== word[i]) {
        return false;
      }
      currentPosition = currentPosition.add(direction);
    }
    return true;
  }
}

export function printSolutions4(): void {
  const solver = new Solver();
  console.log(solver.getNumberOfWords("XMAS"));
  console.log(solver.getNumberOfWordCrosses("MAS"));
}