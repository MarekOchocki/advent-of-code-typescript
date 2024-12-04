import * as fs from 'fs';

function printSolution3Part1() {
  const input = fs.readFileSync('./app/2024/res/input3.txt').toString();
  const regex = /mul\((\d+)\,(\d+)\)/g;
  const values = [...input.matchAll(regex)].map(regArray => +regArray[1] * +regArray[2]);
  const sum = values.reduce((prev, curr) => prev + curr);
  console.log(sum);
}

function printSolution3Part2() {
  const input = fs.readFileSync('./app/2024/res/input3.txt').toString();
  const regex = /mul\((\d+)\,(\d+)\)|don\'t\(\)|do\(\)/g;
  const values = [...input.matchAll(regex)].map(regArr => regArr[0].startsWith('mul') ? (+regArr[1]) * (+regArr[2]) : regArr[0] === 'do()');
  let sum = 0;
  let isEnabled = true;
  for(const value of values) {
    if(typeof value === 'boolean') {
      isEnabled = value;
      continue;
    }
    sum += isEnabled ? value : 0;
  }
  console.log(sum);
}

export function printSolutions3(): void {
  printSolution3Part1();
  printSolution3Part2();
}