import * as fs from 'fs';
import { GridPoligon, GridPoligonSide } from "../utils/GridPoligon";
import { Vector2 } from "../utils/Vector2";

class InputEntry {
  public direction: Vector2;
  public length: number;

  public direction2: Vector2;
  public length2: number;

  constructor(line: string) {
    const parts = line.split(" ");
    this.direction = this.mapCharToDirection(parts[0]);
    this.length = +parts[1];
    const hexadecimalLength2 = parts[2].substring(2, parts[2].length-2);
    this.length2 = Number.parseInt(hexadecimalLength2, 16);
    this.direction2 = this.mapCharToDirection2(parts[2][parts[2].length-2]);
  }

  private mapCharToDirection(char: string): Vector2 {
    if(char === "R") { return Vector2.Right(); }
    if(char === "D") { return Vector2.Down(); }
    if(char === "L") { return Vector2.Left(); }
    return Vector2.Up()
  }

  private mapCharToDirection2(char: string): Vector2 {
    if(char === "0") { return Vector2.Right(); }
    if(char === "1") { return Vector2.Down(); }
    if(char === "2") { return Vector2.Left(); }
    return Vector2.Up()
  }
}

function parseInput(): InputEntry[] {
  const inputContent = fs.readFileSync('./app/res/week3/input18.txt').toString();
  return inputContent.split("\n").map(line => new InputEntry(line));
}

function printSolution18Part1(): void {
  const entries = parseInput();
  const sides = entries.map(e => new GridPoligonSide(e.direction, e.length));
  const poligon = new GridPoligon(new Vector2(0, 0), sides);
  console.log(poligon.perimeter + poligon.area);
}

function printSolution18Part2() {
  const entries = parseInput();
  const sides = entries.map(e => new GridPoligonSide(e.direction2, e.length2));
  const poligon = new GridPoligon(new Vector2(0, 0), sides);
  console.log(poligon.perimeter + poligon.area);
}

export function printSolutions18() {
  printSolution18Part1();
  printSolution18Part2();
}