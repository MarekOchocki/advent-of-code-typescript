import * as fs from 'fs';
import { Vector2 } from '../../utils/Vector2';
import { GridPoligon } from '../../utils/GridPoligon';

const pipeToVectorMap = new Map<string, Vector2>([
  ["|", new Vector2(0, 0)],
  ["-", new Vector2(0, 0)],
  ["F", new Vector2(1, 1)],
  ["J", new Vector2(-1, -1)],
  ["L", new Vector2(1, -1)],
  ["7", new Vector2(-1, 1)]
]);

class Pipe {
  constructor(public pipeChar: string) {
  }

  public getNextDirection(from: Vector2): Vector2 {
    return this.getVectorForPipe().add(from);
  }
  
  private getVectorForPipe(): Vector2 {
    return pipeToVectorMap.get(this.pipeChar) as Vector2;
  }
}

class LoopSide {
  constructor(public direction: Vector2, public length: number) { }
}

class PipeMatrix {
  private startPipePosition: Vector2;
  private gridPoligon: GridPoligon;

  constructor() {
    const inputContent = fs.readFileSync('./app/2023/res/input10.txt').toString();
    let inputLines = inputContent.split('\n');
    const pipes: Pipe[][] = inputLines.map(line => line.split("").map(c => new Pipe(c)));
    this.startPipePosition = this.findStartPipePosition(pipes);
    this.replaceStartPipeCharWithPipe(pipes);
    this.gridPoligon = new GridPoligon(this.findLoopSides(pipes));
  }

  public getLoopLength(): number {
    return this.gridPoligon.perimeter;
  }

  public getNumberOfInsideTiles(): number {
    return this.gridPoligon.area;
  }

  private getElement(pipes: Pipe[][], position: Vector2): Pipe {
    return pipes[position.y][position.x];
  }

  private findLoopSides(pipes: Pipe[][]): LoopSide[] {
    let currentPosition = this.startPipePosition;
    let currentDirection = new Vector2(1, 0); // TODO: replace with something that is not input specific

    const sides: LoopSide[] = [];
    let currentSideLength = 0;
    do {
      currentPosition = currentPosition.add(currentDirection);
      let currentPipe = this.getElement(pipes, currentPosition);
      currentSideLength++;
      
      let nextDirection = currentPipe.getNextDirection(currentDirection);
      if(!nextDirection.equals(currentDirection)) {
        sides.push(new LoopSide(currentDirection, currentSideLength));
        currentSideLength = 0;
      }
      currentDirection = nextDirection;
    } while(!currentPosition.equals(this.startPipePosition))

    if(currentSideLength !== 0) {
      sides.push(new LoopSide(currentDirection, currentSideLength));
    }
    return sides;
  }

  private replaceStartPipeCharWithPipe(pipes: Pipe[][]): void {
    this.getElement(pipes, this.startPipePosition).pipeChar = "-"; // TODO: replace with something that is not input specific
  }

  private findStartPipePosition(pipes: Pipe[][]): Vector2 {
    for(let i = 0; i < pipes.length; i++) {
      for(let j = 0; j < pipes[i].length; j++) {
        if(pipes[i][j].pipeChar === "S") {
          return new Vector2(j, i);
        }
      }
    }
    return new Vector2(0, 0);
  }
}

export function printSolutions10() {
  const pipeMatrix = new PipeMatrix();
  console.log(pipeMatrix.getLoopLength() / 2);
  console.log(pipeMatrix.getNumberOfInsideTiles());
}