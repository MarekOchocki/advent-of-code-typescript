import * as fs from 'fs';

enum Rotation {
  Clockwise,
  Counterclockwise
}

class Vector2 {
  constructor(public x: number, public y: number) { }

  public add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  public subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  public equals(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public rotate(rotation: Rotation): Vector2 {
    if(rotation === Rotation.Clockwise) {
      return new Vector2(-this.y, this.x);
    }
    return new Vector2(this.y, -this.x);
  }

  public static Right(): Vector2 {
    return new Vector2(1, 0);
  }

  public static Left(): Vector2 {
    return new Vector2(-1, 0);
  }

  public static Up(): Vector2 {
    return new Vector2(0, -1);
  }

  public static Down(): Vector2 {
    return new Vector2(0, 1);
  }
}

class Tile {
  private energizedDirections = [false, false, false, false];

  constructor(public tileChar: string) { }

  isEnergizedInDirection(direction: Vector2): boolean {
    return this.energizedDirections[this.directionToIndex(direction)];
  }

  energize(direction: Vector2): boolean {
    return this.energizedDirections[this.directionToIndex(direction)] = true;
  }
  
  isEnergized(): boolean {
    return this.energizedDirections.some(d => d === true);
  }

  reset(): void {
    this.energizedDirections = [false, false, false, false];
  }

  private directionToIndex(direction: Vector2): number {
    if(direction.equals(Vector2.Up())) { return 0; }
    if(direction.equals(Vector2.Right())) { return 1; }
    if(direction.equals(Vector2.Down())) { return 2; }
    return 3;
  }
}

class Matrix<T> {
  private constructor(private elements: T[][]) { }
  static from2DArray<T>(elements: T[][]): Matrix<T> {
    return new Matrix<T>(elements);
  }

  get(position: Vector2): T {
    return this.elements[position.y][position.x];
  }
}

function forEach2D<T>(array2D: T[][], callback: (t: T) => void): void {
  array2D.forEach(line => line.forEach(el => callback(el)));
}

function map2D<T, R>(array2D: T[][], callback: (t: T) => R): R[][] {
  return array2D.map(line => line.map(el => callback(el)));
}

function sum2D(numbers: number[][]): number {
  return numbers.reduce((acc, line) => acc + line.reduce((accIn, el) => accIn + el), 0);
}

function parseInput(): Tile[][] {
  const inputContent = fs.readFileSync('./app/res/week3/input16.txt').toString();
  return inputContent.split("\n").map(line => line.split("").map(c => new Tile(c)));
}

function processBeam(tiles: Tile[][], source: Vector2, direction: Vector2): void {
  if(tiles[source.y] !== undefined && tiles[source.y][source.x] !== undefined) {
    if(tiles[source.y][source.x].isEnergizedInDirection(direction)) { return; }
    tiles[source.y][source.x].energize(direction);
  }
  const destination = source.add(direction);
  if(tiles[destination.y] === undefined || tiles[destination.y][destination.x] === undefined) { return; }
  const destTile = tiles[destination.y][destination.x];
  if(destTile.tileChar === ".") {
    processBeam(tiles, destination, direction);
    return;
  }
  if(destTile.tileChar === "/") {
    if(direction.equals(Vector2.Right()) || direction.equals(Vector2.Left())) {
      processBeam(tiles, destination, direction.rotate(Rotation.Counterclockwise));
    } else {
      processBeam(tiles, destination, direction.rotate(Rotation.Clockwise));
    }
    return;
  }
  if(destTile.tileChar === "\\") {
    if(direction.equals(Vector2.Right()) || direction.equals(Vector2.Left())) {
      processBeam(tiles, destination, direction.rotate(Rotation.Clockwise));
    } else {
      processBeam(tiles, destination, direction.rotate(Rotation.Counterclockwise));
    }
    return;
  }
  if(destTile.tileChar === "-") {
    if(direction.equals(Vector2.Right()) || direction.equals(Vector2.Left())) {
      processBeam(tiles, destination, direction);
    } else {
      processBeam(tiles, destination, Vector2.Left());
      processBeam(tiles, destination, Vector2.Right());
    }
    return;
  }
  if(destTile.tileChar === "|") {
    if(direction.equals(Vector2.Up()) || direction.equals(Vector2.Down())) {
      processBeam(tiles, destination, direction);
    } else {
      processBeam(tiles, destination, Vector2.Up());
      processBeam(tiles, destination, Vector2.Down());
    }
    return;
  }
}

function getResultForStartingBeam(tiles: Tile[][], source: Vector2, direction: Vector2): number {
  processBeam(tiles, source, direction);
  const result = sum2D(map2D(tiles, t => t.isEnergized() ? 1 : 0));
  forEach2D(tiles, t => t.reset());
  return result;
}

function printSolution16Part1() {
  const tiles = parseInput();
  const result = getResultForStartingBeam(tiles, new Vector2(-1, 0), Vector2.Right());
  console.log(result);
}

function printSolution16Part2() {
  const tiles = parseInput();
  let max = 0;
  for(let y = 0; y < tiles.length; y++) {
    const resultRight = getResultForStartingBeam(tiles, new Vector2(-1, y), Vector2.Right());
    const resultLeft = getResultForStartingBeam(tiles, new Vector2(tiles[0].length, y), Vector2.Left());
    max = Math.max(max, resultRight, resultLeft);
  }
  for(let x = 0; x < tiles[0].length; x++) {
    const resultDown = getResultForStartingBeam(tiles, new Vector2(x, -1), Vector2.Down());
    const resultUp = getResultForStartingBeam(tiles, new Vector2(x, tiles.length), Vector2.Up());
    max = Math.max(max, resultDown, resultUp);
  }
  console.log(max);
}

export function printSolutions16() {
  printSolution16Part1();
  printSolution16Part2();
}