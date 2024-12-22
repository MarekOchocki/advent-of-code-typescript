import * as fs from 'fs';
import { Matrix } from '../../utils/Matrix';
import { Rotation, Vector2 } from '../../utils/Vector2';
import { binarySearchThroughIntegers } from '../../utils/binary-search';
import { CircularBuffer } from '../../utils/CircularBuffer';

class MazeTile {
  private score = -1;
  constructor(public type: string) {}

  reset() {
    this.score = -1;
    this.type = '.';
  }

  setScore(score: number) {
    this.score = score;
  }

  hasBeenChecked(): boolean {
    return this.score !== -1 || this.type === '#';
  }

  getScore(): number {
    return this.score;
  }
}

interface Move {
  from: Vector2;
  direction: Vector2;
  scoreAfterMove: number;
}

class Maze {
  public mazeGrid: Matrix<MazeTile>;
  public bytes: Vector2[];
  public bytesCorruptions = 0;

  constructor(input: string, gridSize: Vector2) {
    this.mazeGrid = Matrix.fromDimensions(gridSize, () => new MazeTile('.'));
    this.bytes = input.split('\n').map(line => {
      const [left, right] = line.split(',');
      return new Vector2(+left, +right);
    });
  }

  getMaxBytesCorruptions(): number {
    return this.bytes.length;
  }

  getMinimumNumberOfSteps(): number {
    const endTilePosition = this.mazeGrid.getSize().subtract(new Vector2(1, 1));
    const endTile = this.mazeGrid.get(endTilePosition);
    if(!endTile) throw "Error: Can't find end position";
    return endTile.getScore();
  }


  corrupt(bytesNumber: number): void {
    this.resetCorruption();
    bytesNumber = Math.min(this.bytes.length, bytesNumber);
    for(let i = 0; i < bytesNumber; i++) {
      this.mazeGrid.get(this.bytes[this.bytesCorruptions])!.type = '#';
      this.bytesCorruptions++;
    }
    this.traverseMaze(new Vector2(0, 0));
  }
  
  private resetCorruption() {
    this.bytesCorruptions = 0;
    this.mazeGrid.forEach(tile => tile.reset());
  }

  private traverseMaze(startPosition: Vector2) {
    const startTile = this.mazeGrid.get(startPosition)!;
    startTile.setScore(0);

    const movesToCheck = new CircularBuffer<Move>(400);
    movesToCheck.pushBack({from: startPosition, direction: Vector2.Left(), scoreAfterMove: 1});
    movesToCheck.pushBack({from: startPosition, direction: Vector2.Down(), scoreAfterMove: 1});
    movesToCheck.pushBack({from: startPosition, direction: Vector2.Right(), scoreAfterMove: 1});
    movesToCheck.pushBack({from: startPosition, direction: Vector2.Up(), scoreAfterMove: 1});

    let move : Move | null = null;
    while(movesToCheck.getSize() !== 0) {
      move = movesToCheck.popFront();
      const newMoves = this.checkMove(move as Move);
      for(const newMove of newMoves) {
        movesToCheck.pushBack(newMove);  
      }
    }
  }

  private checkMove(move: Move): Move[] {
    const destinationPosition = move.from.add(move.direction);
    const tile = this.mazeGrid.get(destinationPosition);
    if(!tile || tile.hasBeenChecked()) return [];
    tile.setScore(move.scoreAfterMove);
    return [
      {from: destinationPosition, direction: move.direction, scoreAfterMove: move.scoreAfterMove + 1},
      {from: destinationPosition, direction: move.direction.rotate(Rotation.Clockwise), scoreAfterMove: move.scoreAfterMove + 1},
      {from: destinationPosition, direction: move.direction.rotate(Rotation.Counterclockwise), scoreAfterMove: move.scoreAfterMove + 1},
    ];
  }
}

function printSolution18Part1(): void {
  const input = fs.readFileSync('./app/2024/res/input18.txt').toString();
  const maze = new Maze(input, new Vector2(71, 71));
  maze.corrupt(1024);
  console.log(maze.getMinimumNumberOfSteps());
}

function printSolution18Part2(): void {
  const input = fs.readFileSync('./app/2024/res/input18.txt').toString();
  const maze = new Maze(input, new Vector2(71, 71));

  const byteId = binarySearchThroughIntegers(1, maze.getMaxBytesCorruptions(), (candidate) => {
    maze.corrupt(candidate + 1);
    return maze.getMinimumNumberOfSteps();
  });

  if(byteId.type !== 'inbetweenIntegers') {
    throw "something went wrong";
  }

  console.log(input.split('\n')[byteId.value.tooLarge]);
}

export function printSolutions18(): void {
  printSolution18Part1();
  printSolution18Part2();
}