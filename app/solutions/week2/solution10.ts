import * as fs from 'fs';

class Vector2i {
  constructor(public x: number, public y: number) { }

  public add(other: Vector2i): Vector2i {
    return new Vector2i(this.x + other.x, this.y + other.y);
  }

  public subtract(other: Vector2i): Vector2i {
    return new Vector2i(this.x - other.x, this.y - other.y);
  }

  public equals(other: Vector2i): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public rotate(rotation: Rotation): Vector2i {
    if(rotation === Rotation.Clockwise) {
      return new Vector2i(-this.y, this.x);
    }
    return new Vector2i(this.y, -this.x);
  }
}

enum Rotation {
  Clockwise,
  Counterclockwise
}

const pipeToVectorMap = new Map<string, Vector2i>([
  ["|", new Vector2i(0, 0)],
  ["-", new Vector2i(0, 0)],
  ["F", new Vector2i(1, 1)],
  ["J", new Vector2i(-1, -1)],
  ["L", new Vector2i(1, -1)],
  ["7", new Vector2i(-1, 1)]
]);

class Pipe {
  private isMarkedAsInside = false;
  private isMarkedAsLoop = false;

  constructor(public pipeChar: string) {
  }

  public markAsInside(): void {
    this.isMarkedAsInside = true;
  }

  public isInside(): boolean {
    return this.isMarkedAsInside;
  }

  public markAsLoop(): void {
    this.isMarkedAsLoop = true;
  }

  public isPartOfLoop(): boolean {
    return this.isMarkedAsLoop;
  }

  public getNextDirection(from: Vector2i): Vector2i {
    return this.getVectorForPipe().add(from);
  }

  public getRotationToNextDireciton(from: Vector2i): Rotation | undefined {
    const nextDirection = this.getNextDirection(from);
    if(from.rotate(Rotation.Clockwise).equals(nextDirection)) {
      return Rotation.Clockwise;
    }
    if(from.rotate(Rotation.Counterclockwise).equals(nextDirection)) {
      return Rotation.Counterclockwise;
    }
    return undefined;
  }
  
  private getVectorForPipe(): Vector2i {
    return pipeToVectorMap.get(this.pipeChar) as Vector2i;
  }
}

class PipeMatrix {
  private pipes: Pipe[][] = []; 
  private loopLength: number;
  private startPipePosition: Vector2i;
  private startDirection = new Vector2i(1, 0); // TODO: replace with something that is not input specific
  private startInsideDirection: Vector2i;
  private numberOfInsideTiles: number;

  constructor() {
    const inputContent = fs.readFileSync('./app/res/week2/input10.txt').toString();
    let inputLines = inputContent.split('\n');
    this.pipes = inputLines.map(line => line.split("").map(c => new Pipe(c)));
    this.startPipePosition = this.findStartPipePosition();
    this.replaceStartPipeCharWithPipe();
    this.loopLength = this.findLoopLength();
    this.markPipesFromLoop();
    this.startInsideDirection = this.findStartInsideDirection();
    this.markInsideTiles();
    this.numberOfInsideTiles = this.findNumberOfInsideTiles();
  }

  public getLoopLength(): number {
    return this.loopLength;
  }

  public getNumberOfInsideTiles(): number {
    return this.numberOfInsideTiles;
  }

  private getElement(position: Vector2i): Pipe {
    return this.pipes[position.y][position.x];
  }

  private forEachTile(callback: (pipe: Pipe) => void): void {
    for(let i = 0; i < this.pipes.length; i++) {
      for(let j = 0; j < this.pipes[i].length; j++) {
        callback(this.pipes[i][j]);
      }
    }
  }

  private forEachLoopPipe(callback: (pipe: Pipe, fromDirection: Vector2i, position: Vector2i) => void): void {
    let currentPosition = this.startPipePosition;
    let currentDirection = this.startDirection;
    do {
      currentPosition = currentPosition.add(currentDirection);
      let currentPipe = this.getElement(currentPosition);
      callback(currentPipe, currentDirection, currentPosition);
      currentDirection = currentPipe.getNextDirection(currentDirection);
    } while(!currentPosition.equals(this.startPipePosition))
  }

  private forEachNonLoopPipeInDirection(from: Vector2i, direction: Vector2i, callback: (pipe: Pipe) => void): void {
    let currentPosition = from.add(direction);
    let currentPipe = this.getElement(currentPosition);
    while(!currentPipe.isPartOfLoop()) {
      callback(currentPipe);
      currentPosition = currentPosition.add(direction);
      currentPipe = this.getElement(currentPosition);
    }
  }

  private replaceStartPipeCharWithPipe(): void {
    this.getElement(this.startPipePosition).pipeChar = "-"; // TODO: replace with something that is not input specific
  }

  private findStartPipePosition(): Vector2i {
    for(let i = 0; i < this.pipes.length; i++) {
      for(let j = 0; j < this.pipes[i].length; j++) {
        if(this.pipes[i][j].pipeChar === "S") {
          return new Vector2i(j, i);
        }
      }
    }
    return new Vector2i(0, 0);
  }

  private findLoopLength(): number {
    let steps = 0;
    this.forEachLoopPipe(_ => steps++);
    return steps;
  }

  private markPipesFromLoop(): void {
    this.forEachLoopPipe(pipe => pipe.markAsLoop());
  }

  private findStartInsideDirection(): Vector2i {
    let numberOfClockwiseTurns = this.findNumberOfClockwiseTurns();
    if(numberOfClockwiseTurns < 0) {
      return this.startDirection.rotate(Rotation.Counterclockwise);
    }
    return this.startDirection.rotate(Rotation.Clockwise);
  }

  private findNumberOfClockwiseTurns(): number {
    let numberOfClockwiseTurns = 0;
    this.forEachLoopPipe((pipe, from) => {
      let rotation = pipe.getRotationToNextDireciton(from);
      if(rotation === undefined) return;
      numberOfClockwiseTurns += rotation === Rotation.Clockwise ? 1 : -1;
    });
    return numberOfClockwiseTurns;
  }

  private markInsideTiles(): void {
    let insideDirection = this.startInsideDirection;
    this.forEachLoopPipe((currentPipe, from, currentPosition) => {
      this.forEachNonLoopPipeInDirection(currentPosition, insideDirection, (pipe) => pipe.markAsInside());
      let rotation = currentPipe.getRotationToNextDireciton(from);
      if(rotation !== undefined) {
        insideDirection = insideDirection.rotate(rotation);
        this.forEachNonLoopPipeInDirection(currentPosition, insideDirection, (pipe) => pipe.markAsInside());
      }
    });
  }

  private findNumberOfInsideTiles(): number {
    let insideTilesNumber = 0;
    this.forEachTile(pipe => insideTilesNumber += pipe.isInside() ? 1 : 0);
    return insideTilesNumber;
  }
}

export function printSolutions10() {
  const pipeMatrix = new PipeMatrix();
  console.log(pipeMatrix.getLoopLength() / 2);
  console.log(pipeMatrix.getNumberOfInsideTiles());
}