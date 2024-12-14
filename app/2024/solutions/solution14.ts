import * as fs from 'fs';
import { Vector2 } from '../../utils/Vector2';
import { Matrix } from '../../utils/Matrix';

const allDirections: Vector2[] = [
  Vector2.Up(),
  Vector2.Right(),
  Vector2.Down(),
  Vector2.Left()
];

class Robot {
  public position: Vector2;
  private velocity: Vector2;

  constructor(inputLine: string, private spaceDimension: Vector2) {
    const numbers = [...inputLine.matchAll(/(-?\d+)/g)].map(regArr => +regArr[1]);
    this.position = new Vector2(numbers[0], numbers[1]);
    this.velocity = new Vector2(numbers[2] + this.spaceDimension.x, numbers[3] + this.spaceDimension.y);
  }

  move(seconds: number) {
    this.position = this.position.add(this.velocity.multiply(seconds));
    this.position.x = this.position.x % this.spaceDimension.x;
    this.position.y = this.position.y % this.spaceDimension.y;
  }

  getQuadrantId(): number | null {
    const middleX = Math.floor(this.spaceDimension.x / 2);
    const middleY = Math.floor(this.spaceDimension.y / 2);
    if(this.position.x === middleX || this.position.y === middleY) {
      return null;
    }
    if(this.position.x < middleX) {
      return this.position.y < middleY ? 0 : 2;
    }
    return this.position.y < middleY ? 1 : 3;
  }
}

class Room {
  private roomGrid: Matrix<string>;
  public numberOfAreas = 0;

  constructor(input: string) {
    this.roomGrid = Matrix.fromString(input, c => c);
    this.markAreas();
  }
  
  removeMarks(robots: Robot[]) {
    robots.forEach(r => {
      this.roomGrid.set(r.position, '.');
    });
    this.numberOfAreas = 0;
  }

  addMarks(robots: Robot[]) {
    robots.forEach(r => {
      this.roomGrid.set(r.position, 'X');
    });
    this.markAreas();
  }

  private markAreas() {
    this.numberOfAreas = 0;
    this.roomGrid.forEach((tile, position) => {
      if(tile === 'X') {
        this.markAreaWithId(position);
        this.numberOfAreas++;
      }
    });
  }

  private markAreaWithId(position: Vector2) {
    const tile = this.roomGrid.get(position);
    if(!tile || tile !== 'X') {
      return;
    }
    this.roomGrid.set(position, 'O');
    allDirections.forEach(direction => this.markAreaWithId(position.add(direction)));
  }
}

function getSafetyFactorAfter(seconds: number, robots: Robot[]): number {
  robots.forEach(r => r.move(seconds));
  const safetyFactor = [0, 0, 0, 0];
  robots.map(r => r.getQuadrantId()).forEach(id => id === null ? null : safetyFactor[id]++);
  return safetyFactor.reduce((acc, val) => acc * val);
}

function toPicture(robots: Robot[], roomDimensions: Vector2): string {
  const picture: string[][] = new Array(roomDimensions.y).fill(0).map(_ => new Array(roomDimensions.x).fill('.'));
  robots.forEach(r => picture[r.position.y][r.position.x] = 'X');
  return picture.map(line => line.join('')).join('\n');
}

function printSolution14Part1(): void {
  const input = fs.readFileSync('./app/2024/res/input14.txt').toString();
  const spaceDimension = new Vector2(101, 103);
  const robots = input.split('\n').map(line => new Robot(line, spaceDimension));
  const sum = getSafetyFactorAfter(100, robots);
  console.log(sum);
}

function printSolution14Part2(): void {
  const input = fs.readFileSync('./app/2024/res/input14.txt').toString();
  const spaceDimension = new Vector2(101, 103);
  const robots = input.split('\n').map(line => new Robot(line, spaceDimension));
  const roomMap = new Room(toPicture(robots, spaceDimension));

  let minimumNumberOfAreas = 10000;
  let resultSeconds = 0;
  for(let i = 0; i < 10000; i++) {
    if(roomMap.numberOfAreas < minimumNumberOfAreas) {
      minimumNumberOfAreas = roomMap.numberOfAreas;
      resultSeconds = i;
    }
    roomMap.removeMarks(robots);
    robots.forEach(r => r.move(1));
    roomMap.addMarks(robots);
  }
  console.log(resultSeconds);
}

export function printSolutions14(): void {
  printSolution14Part1();
  printSolution14Part2();
}