import * as fs from 'fs';
import { Matrix } from '../utils/Matrix';
import { Vector2 } from '../utils/Vector2';
import { Vector3 } from '../utils/Vector3';

class FloorTile {
  constructor(public brickId: number, public z: number) {
  }
}

class BrickInAir {
  public startPoint2D: Vector2;
  public endPoint2D: Vector2;
  public z: number;
  public height: number;
  public direction2D: Vector2 = new Vector2(1, 0);
  public length2D: number;

  public canBeSafelyDesintegrated = true;
  public supportingBricks: number[] = [];

  constructor(line: string) {
    const parts = line.split("~");
    const startPoint = this.makePointFromInput(parts[0]);
    const endPoint = this.makePointFromInput(parts[1]);
    this.z = Math.min(startPoint.z, endPoint.z);
    this.height = Math.abs(startPoint.z - endPoint.z) + 1;
    this.startPoint2D = new Vector2(startPoint.x, startPoint.y);
    this.endPoint2D = new Vector2(endPoint.x, endPoint.y);
    const diff = this.endPoint2D.subtract(this.startPoint2D);
    this.length2D = Math.abs(diff.x) + Math.abs(diff.y) + 1;
    if(this.length2D > 1) {
      this.direction2D = diff.divide(this.length2D - 1);
    }
  }

  land(floor: Matrix<FloorTile>, bricksList: BrickInAir[], brickId: number) {
    const highestZOnTheFloor = this.findHighestZOnTheFloor(floor);
    const bricksBelow: number[] = [];

    const afterEnd = this.endPoint2D.add(this.direction2D);
    for(let point = this.startPoint2D; !point.equals(afterEnd); point = point.add(this.direction2D)) {
      const tile = floor.get(point);
      this.assertDefined(tile);

      if(tile.z === highestZOnTheFloor && tile.brickId !== -1) {
        if(bricksBelow.length === 0 || bricksBelow[bricksBelow.length - 1] !== tile.brickId) {
          bricksBelow.push(tile.brickId);
        }
      }
      tile.brickId = brickId;
      tile.z = highestZOnTheFloor + this.height;
    }

    if(bricksBelow.length > 1) {
      this.supportingBricks = [...bricksList[bricksBelow[0]].supportingBricks];
      for(let i = 1; i < bricksBelow.length; i++) {
        this.supportingBricks = this.supportingBricks.filter(el => bricksList[bricksBelow[i]].supportingBricks.some(el2 => el === el2));
      }
    }
    if(bricksBelow.length === 1) {
      this.supportingBricks = [bricksBelow[0], ...bricksList[bricksBelow[0]].supportingBricks];
    }
    this.supportingBricks.forEach(brickId => {
      bricksList[brickId].canBeSafelyDesintegrated = false;
    });
  }

  private makePointFromInput(inputPart: string): Vector3 {
    const numbers = inputPart.split(',');
    const x = +numbers[0];
    const y = +numbers[1];
    const z = +numbers[2];
    return new Vector3(x, y, z);
  }

  private findHighestZOnTheFloor(floor: Matrix<FloorTile>): number {
    const afterEnd = this.endPoint2D.add(this.direction2D);
    let result = -999999;
    for(let point = this.startPoint2D; !point.equals(afterEnd); point = point.add(this.direction2D)) {
      const tile = floor.get(point);
      this.assertDefined(tile);
      result = Math.max(tile.z, result);
    }
    return result;
  }

  private assertDefined<T>(value: T | undefined): asserts value is T {
    if(value === undefined) {
      throw "Value should be defined";
    }
  }
}

function parseInput(): BrickInAir[] {
  const inputContent = fs.readFileSync('./app/res/week4/input22.txt').toString();
  return inputContent.split("\n").map(line => new BrickInAir(line));
}

export function printSolutions22(): void {
  const bricks = parseInput();
  const largestX = bricks.reduce((prev, curr) => Math.max(prev, curr.startPoint2D.x, curr.endPoint2D.x), 0);
  const largestY = bricks.reduce((prev, curr) => Math.max(prev, curr.startPoint2D.y, curr.endPoint2D.y), 0);
  bricks.sort((a, b) => a.z - b.z);

  const floor = Matrix.fromDimensions<FloorTile>(new Vector2(largestX+1, largestY+1), () => new FloorTile(-1, 0));
  bricks.forEach((brick, i) => {
    brick.land(floor, bricks, i);
  });

  const result = bricks.reduce((prev, curr) => prev + (curr.canBeSafelyDesintegrated ? 1 : 0), 0);
  const result2 = bricks.reduce((prev, curr) => prev + curr.supportingBricks.length, 0);
  console.log(result);
  console.log(result2);
}
