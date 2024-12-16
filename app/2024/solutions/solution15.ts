import * as fs from 'fs';
import { Vector2 } from '../../utils/Vector2';
import { Matrix } from '../../utils/Matrix';

class Warehouse {
  private robotPosition: Vector2;
  public grid: Matrix<string>;

  constructor(mapString: string) {
    this.grid = Matrix.fromString(mapString, c => c);
    this.robotPosition = this.grid.findPosition(c => c === '@')!;
    this.grid.set(this.robotPosition, '.');
  }

  moveRobot(direction: Vector2) {
    const nextTilePosition = this.robotPosition.add(direction);
    const nextTileType = this.grid.get(nextTilePosition)
    if(nextTileType === '.') {
      this.robotPosition = nextTilePosition;
      return;
    }
    if(nextTileType === '#') {
      return;
    }
    this.attemptToShoveBoxes(direction);
  }

  getSumOfAllBoxesGPDCoordinates(): number {
    return this.grid.reduce((acc, tile, position) => {
      return acc + (tile === 'O' ? position.x + position.y * 100 : 0);
    }, 0);
  }

  private attemptToShoveBoxes(direction: Vector2) {
    const firstBoxPosition = this.robotPosition.add(direction);
    const lastBoxPosition = this.findLastBoxInSequencePosition(firstBoxPosition, direction);
    const tileAfterLastBoxPosition = lastBoxPosition.add(direction);
    const tileAfterLastBox = this.grid.get(tileAfterLastBoxPosition);
    if(tileAfterLastBox === '#') {
      return;
    }
    this.grid.set(tileAfterLastBoxPosition, 'O');
    this.grid.set(firstBoxPosition, '.');
    this.robotPosition = this.robotPosition.add(direction);
  }

  private findLastBoxInSequencePosition(firstBoxPosition: Vector2, direction: Vector2): Vector2 {
    let lastBoxPosition = firstBoxPosition;
    let nextBoxToCheck = lastBoxPosition.add(direction);
    while(this.grid.get(nextBoxToCheck) === 'O') {
      lastBoxPosition = nextBoxToCheck;
      nextBoxToCheck = nextBoxToCheck.add(direction);
    }
    return lastBoxPosition;
  }
}

class ScaledUpWarehouse {
  private robotPosition: Vector2;
  private grid: Matrix<string>;

  constructor(mapString: string) {
    mapString = mapString.replace(/#/g, '##');
    mapString = mapString.replace(/O/g, '[]');
    mapString = mapString.replace(/\./g, '..');
    mapString = mapString.replace(/@/g, '@.');
    this.grid = Matrix.fromString(mapString, c => c);
    this.robotPosition = this.grid.findPosition(c => c === '@')!;
    this.grid.set(this.robotPosition, '.');
  }

  moveRobot(direction: Vector2) {
    const nextTilePosition = this.robotPosition.add(direction);
    const nextTileType = this.grid.get(nextTilePosition)
    if(nextTileType === '.') {
      this.robotPosition = nextTilePosition;
      return;
    }
    if(nextTileType === '#') {
      return;
    }
    this.attemptToShoveBoxes(direction);
  }

  getSumOfAllBoxesGPDCoordinates(): number {
    return this.grid.reduce((acc, tile, position) => {
      return acc + (tile === '[' ? position.x + position.y * 100 : 0);
    }, 0);
  }

  private attemptToShoveBoxes(direction: Vector2) {
    const firstBoxLeftPosition = this.getLeftPositionOfBoxAt(this.robotPosition.add(direction));
    if(this.canBoxBeMoved(firstBoxLeftPosition!, direction)) {
      this.moveBox(firstBoxLeftPosition!, direction);
      this.robotPosition = this.robotPosition.add(direction);
    }
  }

  private moveBox(boxLeftPosition: Vector2, direction: Vector2): void {
    if(direction.y === 0) {
      // horizontal movement
      const potentialNextBoxPosition = boxLeftPosition.add(direction.multiply(2));
      if(this.grid.get(potentialNextBoxPosition) === '[') {
        this.moveBox(potentialNextBoxPosition, direction);
      }
    } else {
      // vertical movement
      const nextTileLeftPosition = boxLeftPosition.add(direction);
      const potentialLeftBoxPosition = this.getLeftPositionOfBoxAt(nextTileLeftPosition);
      if(potentialLeftBoxPosition !== null) {
        this.moveBox(potentialLeftBoxPosition, direction);
      }
      const nextTileRightPosition = nextTileLeftPosition.add(Vector2.Right());
      const potentialRightBoxPosition = this.getLeftPositionOfBoxAt(nextTileRightPosition);
      if(potentialRightBoxPosition !== null) {
        this.moveBox(potentialRightBoxPosition, direction);
      }
    }
    this.grid.set(boxLeftPosition, '.');
    this.grid.set(boxLeftPosition.add(Vector2.Right()), '.');
    const newLeftPosition = boxLeftPosition.add(direction);
    this.grid.set(newLeftPosition, '[');
    this.grid.set(newLeftPosition.add(Vector2.Right()), ']');
  }

  private getLeftPositionOfBoxAt(position: Vector2): Vector2 | null {
    if(this.grid.get(position) === ']') {
      return position.add(Vector2.Left());
    } else if(this.grid.get(position) === '[') {
      return position;
    }
    return null;
  }

  private canBoxBeMoved(boxLeftPosition: Vector2, direction: Vector2): boolean {
    if(direction.y === 0) {
      // horizontal movement
      if(direction.x === -1) {
        return this.canBoxOccupySpace(boxLeftPosition.add(direction), direction);
      } else {
        return this.canBoxOccupySpace(boxLeftPosition.add(direction.multiply(2)), direction);
      }
    } else {
      // vertical movement
      const nextTileLeftPosition = boxLeftPosition.add(direction);
      const nextTileRightPosition = nextTileLeftPosition.add(Vector2.Right());
      return this.canBoxOccupySpace(nextTileLeftPosition, direction) && this.canBoxOccupySpace(nextTileRightPosition, direction);
    }
  }

  private canBoxOccupySpace(spacePosition: Vector2, direction: Vector2): boolean {
    const tile = this.grid.get(spacePosition);
    if(tile === '.') {
      return true;
    }
    if(tile === '#') {
      return false;
    }
    if(tile === '[') {
      return this.canBoxBeMoved(spacePosition, direction);
    }
    return this.canBoxBeMoved(spacePosition.add(new Vector2(-1, 0)), direction);
  }
}

function charToDirection(char: string): Vector2 {
  switch(char) {
    case '^': return Vector2.Up();
    case '>': return Vector2.Right();
    case 'v': return Vector2.Down();
    case '<': return Vector2.Left();
  }
  throw 'invalid char!';
}

function parseInput(): [Warehouse, Vector2[]] {
  const input = fs.readFileSync('./app/2024/res/input15.txt').toString();
  const [mapPart, movementPart] = input.split('\n\n');
  const movesAsOneLine = movementPart.replace(/\n/g, '');
  const movesAsVectors = movesAsOneLine.split('').map(c => charToDirection(c));
  return [new Warehouse(mapPart), movesAsVectors];
}

function parseInputPart2(): [ScaledUpWarehouse, Vector2[]] {
  const input = fs.readFileSync('./app/2024/res/input15.txt').toString();
  const [mapPart, movementPart] = input.split('\n\n');
  const movesAsOneLine = movementPart.replace(/\n/g, '');
  const movesAsVectors = movesAsOneLine.split('').map(c => charToDirection(c))
  return [new ScaledUpWarehouse(mapPart), movesAsVectors];
}

function printSolution15Part1(): void {
  const [warehouse, moves] = parseInput();
  moves.forEach(move => warehouse.moveRobot(move));
  console.log(warehouse.getSumOfAllBoxesGPDCoordinates());
}

function printSolution15Part2(): void {
  const [warehouse, moves] = parseInputPart2();
  moves.forEach(move => warehouse.moveRobot(move));
  console.log(warehouse.getSumOfAllBoxesGPDCoordinates());
}

export function printSolutions15(): void {
  printSolution15Part1();
  printSolution15Part2();
}