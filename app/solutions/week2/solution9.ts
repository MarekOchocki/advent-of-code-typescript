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
  const inputContent = fs.readFileSync('./app/res/week2/input9.txt').toString();
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

export function printSolutions9() {
  printSolution9Part1();
  printSolution9Part2();
}