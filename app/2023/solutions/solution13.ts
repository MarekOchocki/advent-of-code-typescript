import * as fs from 'fs';

type Map = string[];

function parseInput(): Map[] {
  const inputContent = fs.readFileSync('./app/2023/res/input13.txt').toString();
  return inputContent.split('\n\n').map(map => map.split("\n"));
}

function getNumberOfDifferencesOfColumns(map: Map, index1: number, index2: number): number {
  let sum = 0;
  for(let i = 0; i < map.length; i++) {
    if(map[i][index1] !== map[i][index2]) {
      sum++;
    }
  }
  return sum;
}

function getNumberOfDifferencesOfRows(map: Map, index1: number, index2: number): number {
  let sum = 0;
  for(let i = 0; i < map[0].length; i++) {
    if(map[index1][i] !== map[index2][i]) {
      sum++;
    }
  }
  return sum;
}

function getNumberOfSmudgesHorizontalMirror(map: Map, rowIndex: number): number {
  const rowsToCheck = Math.min(rowIndex + 1, map.length - rowIndex - 1);
  let difsSum = 0;
  for(let i = 0; i < rowsToCheck; i++) {
    const topRowIndex = rowIndex - i;
    const bottomRowIndex = rowIndex + i + 1;
    difsSum += getNumberOfDifferencesOfRows(map, topRowIndex, bottomRowIndex);
  }
  return difsSum;
}

function getNumberOfSmudgesVerticalMirror(map: Map, columnIndex: number): number {
  let difsSum = 0;
  const columnsToCheck = Math.min(columnIndex + 1, map[0].length - columnIndex - 1);
  for(let i = 0; i < columnsToCheck; i++) {
    const leftColumnIndex = columnIndex - i;
    const rightColumnIndex = columnIndex + i + 1;
    difsSum += getNumberOfDifferencesOfColumns(map, leftColumnIndex, rightColumnIndex);
  }
  return difsSum;
}

function getScoreForVerticalMirrors(map: Map, expectedSmudges: number): number {
  let sum = 0;
  for(let i = 0; i < map[0].length - 1; i++) {
    if(getNumberOfSmudgesVerticalMirror(map, i) === expectedSmudges) {
      return i+1;
    }
  }
  return sum;
}

function getScoreForHorizontalMirrors(map: Map, expectedSmudges: number): number {
  let sum = 0;
  for(let i = 0; i < map.length - 1; i++) {
    if(getNumberOfSmudgesHorizontalMirror(map, i) === expectedSmudges) {
      return (i+1)*100;
    }
  }
  return sum;
}

function getResultForMap(map: Map, expectedSmudges: number): number {
  return  getScoreForVerticalMirrors(map, expectedSmudges) + getScoreForHorizontalMirrors(map, expectedSmudges);
}

function printSolution13Part1() {
  const maps = parseInput();
  const result = maps.map(m => getResultForMap(m, 0)).reduce((acc, r) => acc + r);
  console.log(result);
}

function printSolution13Part2() {
  const maps = parseInput();
  const result = maps.map(m => getResultForMap(m, 1)).reduce((acc, r) => acc + r);
  console.log(result);
}

export function printSolutions13() {
  printSolution13Part1();
  printSolution13Part2();
}
