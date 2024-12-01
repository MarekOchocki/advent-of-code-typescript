import * as fs from 'fs';

type Map = string[][];

function makeKey(map: Map): string {
  let result = "";
  map.forEach(line => line.forEach(c => result += c));
  return result;
}

function parseInput(): Map {
  const inputContent = fs.readFileSync('./app/2023/res/input14.txt').toString();
  return inputContent.split('\n').map(line => line.split(""));
}

function tiltColumnNorth(map: Map, column: number): void {
  let currentAvailableSpace = 0;
  for(let y = 0; y < map.length; y++) {
    if(map[y][column] === "O") {
      [map[currentAvailableSpace][column], map[y][column]] = [map[y][column], map[currentAvailableSpace][column]];
      currentAvailableSpace++;
    }
    if(map[y][column] === "#") {
      currentAvailableSpace = y + 1;
    }
  }
}

function tiltColumnSouth(map: Map, column: number): void {
  let currentAvailableSpace = map.length - 1;
  for(let y = map.length - 1; y >= 0; y--) {
    if(map[y][column] === "O") {
      [map[currentAvailableSpace][column], map[y][column]] = [map[y][column], map[currentAvailableSpace][column]];
      currentAvailableSpace--;
    }
    if(map[y][column] === "#") {
      currentAvailableSpace = y - 1;
    }
  }
}

function tiltRowEast(map: Map, row: number): void {
  let currentAvailableSpace = 0;
  for(let x = 0; x < map[0].length; x++) {
    if(map[row][x] === "O") {
      [map[row][currentAvailableSpace], map[row][x]] = [map[row][x], map[row][currentAvailableSpace]];
      currentAvailableSpace++;
    }
    if(map[row][x] === "#") {
      currentAvailableSpace = x + 1;
    }
  }
}

function tiltRowWest(map: Map, row: number): void {
  let currentAvailableSpace = map[0].length - 1;
  for(let x = map[0].length - 1; x >= 0; x--) {
    if(map[row][x] === "O") {
      [map[row][currentAvailableSpace], map[row][x]] = [map[row][x], map[row][currentAvailableSpace]];
      currentAvailableSpace--;
    }
    if(map[row][x] === "#") {
      currentAvailableSpace = x - 1;
    }
  }
}

function tiltNorth(map: Map): void {
  for(let x = 0; x < map.length; x++) {
    tiltColumnNorth(map, x);
  }
}

function tiltSouth(map: Map): void {
  for(let x = 0; x < map.length; x++) {
    tiltColumnSouth(map, x);
  }
}

function tiltWest(map: Map): void {
  for(let y = 0; y < map[0].length; y++) {
    tiltRowWest(map, y);
  }
}

function tiltEast(map: Map): void {
  for(let y = 0; y < map[0].length; y++) {
    tiltRowEast(map, y);
  }
}

function getLoadForColumn(map: Map, column: number): number {
  let sum = 0;
  for(let y = 0; y < map.length; y++) {
    if(map[y][column] === "O") {
      sum += map.length - y;
    }
  }
  return sum;
}

function getSumOfLoad(map: Map): number {
  let sum = 0;
  for(let x = 0; x < map.length; x++) {
    sum += getLoadForColumn(map, x);
  }
  return sum;
}

function tiltOneCycle(map: Map): void {
  tiltNorth(map);
  tiltEast(map);
  tiltSouth(map);
  tiltWest(map);
}

function printSolution14Part1() {
  const map = parseInput();
  tiltNorth(map);
  console.log(getSumOfLoad(map));
}

function printSolution14Part2() {
  const map = parseInput();

  const savedMaps = new Map<string, number>();
  const savedResults = new Map<number, number>();
  const target = 1000000000;
  for(let i = 0; i < target; i++) {
    tiltOneCycle(map);
    const key = makeKey(map);
    if(savedMaps.has(key)) {
      const startIndex = (savedMaps.get(key) as number);
      const period = i - startIndex;
      const resultIndex = ((target - startIndex) % period) + startIndex - 1;
      const result = savedResults.get(resultIndex);
      console.log(result);
      return;
    }
    savedMaps.set(key, i);
    savedResults.set(i, getSumOfLoad(map));
  }
}

export function printSolutions14() {
  printSolution14Part1();
  printSolution14Part2();
}
