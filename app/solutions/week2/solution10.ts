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
  public readonly startPipePosition: Vector2i;

  constructor() {
    const inputContent = fs.readFileSync('./app/res/week2/input10.txt').toString();
    let inputLines = inputContent.split('\n');
    this.pipes = inputLines.map(line => line.split("").map(c => new Pipe(c)));
    this.startPipePosition = this.findStartPipePosition();
  }

  public getElement(position: Vector2i): Pipe {
    if(position.x < 0 || position.y < 0 || position.y >= this.pipes.length || position.x >= this.pipes[0].length) {
      throw "unexpected get element outside of boundaries";
    }
    return this.pipes[position.y][position.x];
  }

  public forEachTile(callback: (pipe: Pipe) => void): void {
    for(let i = 0; i < this.pipes.length; i++) {
      for(let j = 0; j < this.pipes[i].length; j++) {
        callback(this.pipes[i][j]);
      }
    }
  }

  public forEachNonLoopPipeInDirection(from: Vector2i, direction: Vector2i, callback: (pipe: Pipe) => void): void {
    let currentPosition = from.add(direction);
    let currentPipe = this.getElement(currentPosition);
    while(!currentPipe.isPartOfLoop()) {
      callback(currentPipe);
      currentPosition = currentPosition.add(direction);
      currentPipe = this.getElement(currentPosition);
    }
  }

  private findStartPipePosition(): Vector2i {
    for(let i = 0; i < this.pipes.length; i++) {
      for(let j = 0; j < this.pipes[i].length; j++) {
        if(this.pipes[i][j].pipeChar === "S") {
          this.pipes[i][j].pipeChar = "-"; // TODO: replace with something that is not input specific
          return new Vector2i(j, i);
        }
      }
    }
    return new Vector2i(0, 0);
  }
}


function printSolution10Part1() {
  const pipeMatrix = new PipeMatrix();
  let steps = 0;
  let currentPosition = pipeMatrix.startPipePosition;
  let currentDirection = new Vector2i(1, 0); // TODO: replace with something that is not input specific
  do {
    currentPosition = currentPosition.add(currentDirection);
    let currentPipe = pipeMatrix.getElement(currentPosition);
    currentDirection = currentPipe.getNextDirection(currentDirection);
    steps++; 
  } while(!currentPosition.equals(pipeMatrix.startPipePosition))
  console.log(steps / 2);
}

function getInsideDirection(numberOfClockwiseTurns: number): Vector2i {
  if(numberOfClockwiseTurns < 0) {
    return new Vector2i(1, 0).rotate(Rotation.Counterclockwise); // TODO: replace with something that is not input specific
  }
  return new Vector2i(1, 0).rotate(Rotation.Clockwise); // TODO: replace with something that is not input specific
}

function printSolution10Part2() {
  const pipeMatrix = new PipeMatrix();
  let currentPosition = pipeMatrix.startPipePosition;
  let currentDirection = new Vector2i(1, 0); // TODO: replace with something that is not input specific
  let numberOfClockwiseTurns = 0;
  do {
    currentPosition = currentPosition.add(currentDirection);
    let currentPipe = pipeMatrix.getElement(currentPosition);
    currentPipe.markAsLoop();
    let rotation = currentPipe.getRotationToNextDireciton(currentDirection);
    if(rotation === Rotation.Clockwise) {
      numberOfClockwiseTurns++;
    }
    if(rotation === Rotation.Counterclockwise) {
      numberOfClockwiseTurns--;
    }
    currentDirection = currentPipe.getNextDirection(currentDirection);
  } while(!currentPosition.equals(pipeMatrix.startPipePosition))

  // 1. parse input
  // 2. mark all pipes that belong to the main loop
  // 4. count every clockwise and counterclockwise turn to determine which direction from start is the inside

  let insideDirection = getInsideDirection(numberOfClockwiseTurns);
  currentPosition = pipeMatrix.startPipePosition;
  currentDirection = new Vector2i(1, 0); // TODO: replace with something that is not input specific
  pipeMatrix.forEachNonLoopPipeInDirection(currentPosition, insideDirection, (pipe) => pipe.markAsInside());
  do {
    currentPosition = currentPosition.add(currentDirection);
    let currentPipe = pipeMatrix.getElement(currentPosition);
    if(!currentPipe) { throw "Error!"; }
    pipeMatrix.forEachNonLoopPipeInDirection(currentPosition, insideDirection, (pipe) => pipe.markAsInside());
    let rotation = currentPipe.getRotationToNextDireciton(currentDirection);
    if(rotation !== undefined) {
      insideDirection = insideDirection.rotate(rotation);
      pipeMatrix.forEachNonLoopPipeInDirection(currentPosition, insideDirection, (pipe) => pipe.markAsInside());
    }
    currentDirection = currentPipe.getNextDirection(currentDirection);
  } while(!currentPosition.equals(pipeMatrix.startPipePosition))

  // 5. traverse the main loop and mark everything in inside direction as inside (every turn needs to also turn the inside_direction_vector)

  let insideTilesNumber = 0;
  pipeMatrix.forEachTile(pipe => insideTilesNumber += pipe.isInside() ? 1 : 0);
  console.log(insideTilesNumber);

  // 6. count all non-loop fields marked "inside"
  // 7. print result
}

export function printSolutions10() {
  printSolution10Part1();
  printSolution10Part2();
}