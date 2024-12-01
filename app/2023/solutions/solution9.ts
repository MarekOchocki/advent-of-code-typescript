import * as fs from 'fs';

function last<T>(list: T[]): T {
  return list[list.length - 1];
}

function makeListOfDiffs(list: number[]): number[] {
  const result: number[] = [];
  for(let i = 1; i < list.length; i++) {
    result.push(list[i] - list[i - 1]);
  }
  return result;
}

function extrapolateNextValue(values: number[]): number {
  let result = last(values);
  let currentDiffs = makeListOfDiffs(values);
  result += last(currentDiffs);
  if(currentDiffs.every(d => d === 0)) {
    return result;
  }
  while(currentDiffs.some(d => d !== 0)) {
    currentDiffs = makeListOfDiffs(currentDiffs);
    result += last(currentDiffs);
  }
  return result;
}

function parseInput(): number[][] {
  const inputContent = fs.readFileSync('./app/2023/res/input9.txt').toString();
  let inputLines = inputContent.split('\n');
  return inputLines.map(line => line.split(" ").map(n => +n));
}

function printSolution9Part1() {
  let values = parseInput();
  let extrapolatedValues = values.map(v => extrapolateNextValue(v));
  const sum = extrapolatedValues.reduce((acc, n) => acc + n);
  console.log(sum);
}

function printSolution9Part2() {
  let values = parseInput();
  let extrapolatedValues = values.map(v => extrapolateNextValue(v.reverse()));
  const sum = extrapolatedValues.reduce((acc, n) => acc + n);
  console.log(sum);
}

function printSolutions9InTwoLines() {
  console.log(fs.readFileSync('./app/2023/res/input9.txt').toString().split('\n').map(line => line.split(" ").map(n => +n)).map(values => ([new Array(values.length-1).fill(0).map((_, i) => i === 0 ? values : _)].map(arr => new Array(values.length).fill(0).forEach((_, i) => arr[i] = arr[i - 1] !== undefined ? (arr[i - 1] as number[]).map((_, i, list) => list[i] - (list[i - 1] ?? 0)).slice(1) : arr[i]) as undefined ?? arr)[0] as number[][]).map(difs => difs[difs.length - 1]).reduce((acc, d) => acc + d)).reduce((acc, n) => acc + n));
  console.log(fs.readFileSync('./app/2023/res/input9.txt').toString().split('\n').map(line => line.split(" ").map(n => +n)).map(values => values.reverse()).map(values => ([new Array(values.length-1).fill(0).map((_, i) => i === 0 ? values : _)].map(arr => new Array(values.length).fill(0).forEach((_, i) => arr[i] = arr[i - 1] !== undefined ? (arr[i - 1] as number[]).map((_, i, list) => list[i] - (list[i - 1] ?? 0)).slice(1) : arr[i]) as undefined ?? arr)[0] as number[][]).map(difs => difs[difs.length - 1]).reduce((acc, d) => acc + d)).reduce((acc, n) => acc + n));
}

export function printSolutions9() {
  printSolution9Part1();
  printSolution9Part2();
}