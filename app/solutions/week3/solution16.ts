import * as fs from 'fs';
import { Rotation, Vector2 } from '../utils/Vector2';
import { Matrix } from '../utils/Matrix';

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

function parseInput(): Matrix<Tile> {
  const inputContent = fs.readFileSync('./app/res/week3/input16.txt').toString();
  return Matrix.fromString(inputContent, c => new Tile(c));
}

function processBeam(tiles: Matrix<Tile>, source: Vector2, direction: Vector2): void {
  const sourceTile = tiles.get(source);
  if(sourceTile !== undefined) {
    if(sourceTile.isEnergizedInDirection(direction)) { return; }
    sourceTile.energize(direction);
  }
  const destination = source.add(direction);
  const destinationTile = tiles.get(destination);
  if(destinationTile === undefined) { return; }
  if(destinationTile.tileChar === ".") {
    processBeam(tiles, destination, direction);
    return;
  }
  if(destinationTile.tileChar === "/") {
    if(direction.equals(Vector2.Right()) || direction.equals(Vector2.Left())) {
      processBeam(tiles, destination, direction.rotate(Rotation.Counterclockwise));
    } else {
      processBeam(tiles, destination, direction.rotate(Rotation.Clockwise));
    }
    return;
  }
  if(destinationTile.tileChar === "\\") {
    if(direction.equals(Vector2.Right()) || direction.equals(Vector2.Left())) {
      processBeam(tiles, destination, direction.rotate(Rotation.Clockwise));
    } else {
      processBeam(tiles, destination, direction.rotate(Rotation.Counterclockwise));
    }
    return;
  }
  if(destinationTile.tileChar === "-") {
    if(direction.equals(Vector2.Right()) || direction.equals(Vector2.Left())) {
      processBeam(tiles, destination, direction);
    } else {
      processBeam(tiles, destination, Vector2.Left());
      processBeam(tiles, destination, Vector2.Right());
    }
    return;
  }
  if(destinationTile.tileChar === "|") {
    if(direction.equals(Vector2.Up()) || direction.equals(Vector2.Down())) {
      processBeam(tiles, destination, direction);
    } else {
      processBeam(tiles, destination, Vector2.Up());
      processBeam(tiles, destination, Vector2.Down());
    }
    return;
  }
}

function getResultForStartingBeam(tiles: Matrix<Tile>, source: Vector2, direction: Vector2): number {
  processBeam(tiles, source, direction);
  let result = 0;
  tiles.forEach(t => result += t.isEnergized() ? 1 : 0);
  tiles.forEach(t => t.reset());
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
  for(let y = 0; y < tiles.getSize().y; y++) {
    const resultRight = getResultForStartingBeam(tiles, new Vector2(-1, y), Vector2.Right());
    const resultLeft = getResultForStartingBeam(tiles, new Vector2(tiles.getSize().x, y), Vector2.Left());
    max = Math.max(max, resultRight, resultLeft);
  }
  for(let x = 0; x < tiles.getSize().x; x++) {
    const resultDown = getResultForStartingBeam(tiles, new Vector2(x, -1), Vector2.Down());
    const resultUp = getResultForStartingBeam(tiles, new Vector2(x, tiles.getSize().y), Vector2.Up());
    max = Math.max(max, resultDown, resultUp);
  }
  console.log(max);
}

export function printSolutions16() {
  printSolution16Part1();
  printSolution16Part2();
}