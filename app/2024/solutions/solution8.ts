import * as fs from 'fs';
import { Matrix } from '../../utils/Matrix';
import { Vector2 } from '../../utils/Vector2';
import { LeastCommonMultipleCalculator } from '../../utils/LeastCommonMultipleCalculator';

class GridElement {
  private frequency: string | undefined;
  private _isAntinode = false;

  constructor(char: string) {
    this.frequency = char === '.' ? undefined : char;
  }

  hasAntenna(): boolean {
    return this.frequency !== undefined;
  }

  getAntennaFrequency(): string {
    return this.frequency ?? '.';
  }

  markAsAntinode(): void {
    this._isAntinode = true;
  }

  isAntinode(): boolean {
    return this._isAntinode;
  }
}

function findDistinctFrequencies(grid: Matrix<GridElement>): string[] {
  const resultSet = new Set<string>();
  grid.forEach(element => {
    if(element.hasAntenna()) {
      resultSet.add(element.getAntennaFrequency());
    }
  });
  return [...resultSet.values()];
}

function findPositionsOfAntennas(grid: Matrix<GridElement>, frequency: string): Vector2[] {
  const result: Vector2[] = [];
  grid.forEach((el, pos) => {
    if(el.hasAntenna() && el.getAntennaFrequency() === frequency) {
      result.push(pos);
    }
  });
  return result;
}

function markAntinodesForPairOfAntennasWithoutHarmoics(grid: Matrix<GridElement>, position1: Vector2, position2:Vector2): void {
  const posDiff = position2.subtract(position1);
  const antinode1Pos = position2.add(posDiff);
  const antinode2Pos = position1.add(posDiff.reverse());
  grid.get(antinode1Pos)?.markAsAntinode();
  grid.get(antinode2Pos)?.markAsAntinode();
}

function markAntinodesForFrequencyWithoutHarmoics(grid: Matrix<GridElement>, frequency: string): void {
  const positionsOfAntennas = findPositionsOfAntennas(grid, frequency);
  for(let i = 0; i < positionsOfAntennas.length; i++) {
    for(let j = i + 1; j < positionsOfAntennas.length; j++) {
      markAntinodesForPairOfAntennasWithoutHarmoics(grid, positionsOfAntennas[i], positionsOfAntennas[j]);
    }
  }
}

function markAntinodesForPairOfAntennas(grid: Matrix<GridElement>, position1: Vector2, position2: Vector2): void {
  const rawPosDiff = position2.subtract(position1);
  const calculator = new LeastCommonMultipleCalculator();
  const posDiffGCD =calculator.getGreatestCommonDivisor(rawPosDiff.x, rawPosDiff.y);
  const posDiff = rawPosDiff.divide(posDiffGCD);
  const reversedPosDiff = posDiff.reverse();
  
  let currentPosition = position1;
  let currentElement = grid.get(currentPosition);
  while(currentElement !== undefined) {
    currentElement.markAsAntinode();
    currentPosition = currentPosition.add(posDiff);
    currentElement = grid.get(currentPosition);
  }
  
  currentPosition = position1;
  currentElement = grid.get(currentPosition);
  while(currentElement !== undefined) {
    currentElement.markAsAntinode();
    currentPosition = currentPosition.add(reversedPosDiff);
    currentElement = grid.get(currentPosition);
  }
}

function markAntinodesForFrequency(grid: Matrix<GridElement>, frequency: string): void {
  const positionsOfAntennas = findPositionsOfAntennas(grid, frequency);
  for(let i = 0; i < positionsOfAntennas.length; i++) {
    for(let j = i + 1; j < positionsOfAntennas.length; j++) {
      markAntinodesForPairOfAntennas(grid, positionsOfAntennas[i], positionsOfAntennas[j]);
    }
  }
}

function printSolutions8Part1(): void {
  const input = fs.readFileSync('./app/2024/res/input8.txt').toString();
  const grid = Matrix.fromString(input, c => new GridElement(c));
  const distinctFrequencies = findDistinctFrequencies(grid);
  distinctFrequencies.forEach(f => markAntinodesForFrequencyWithoutHarmoics(grid, f));
  const sum = grid.reduce((acc, el) => acc += el.isAntinode() ? 1 : 0, 0);
  console.log(sum);
}

function printSolutions8Part2(): void {
  const input = fs.readFileSync('./app/2024/res/input8.txt').toString();
  const grid = Matrix.fromString(input, c => new GridElement(c));
  const distinctFrequencies = findDistinctFrequencies(grid);
  distinctFrequencies.forEach(f => markAntinodesForFrequency(grid, f));
  const sum = grid.reduce((acc, el) => acc += el.isAntinode() ? 1 : 0, 0);
  console.log(sum);
}


export function printSolutions8(): void {
  printSolutions8Part1();
  printSolutions8Part2();
}

