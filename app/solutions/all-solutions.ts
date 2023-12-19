import { printSolutions1 } from './week1/solution1';
import { printSolutions2 } from './week1/solution2';
import { printSolutions3 } from './week1/solution3';
import { printSolutions4 } from './week1/solution4';
import { printSolutions5 } from './week1/solution5';
import { printSolutions6 } from './week1/solution6';
import { printSolutions7 } from './week1/solution7';
import { printSolutions8 } from './week2/solution8';
import { printSolutions9 } from './week2/solution9';
import { printSolutions10 } from './week2/solution10';
import { printSolutions11 } from './week2/solution11';
import { printSolutions12 } from './week2/solution12';
import { printSolutions13 } from './week2/solution13';
import { printSolutions14 } from './week2/solution14';
import { printSolutions15 } from './week3/solution15';
import { printSolutions16 } from './week3/solution16';
import { printSolutions17 } from './week3/solution17';
import { printSolutions18 } from './week3/solution18';
import { printSolutions19 } from './week3/soluton19';

function printSolution(day: number, solution: () => void): void {
  console.log(`\nDay ${day}`);
  solution();
}

function printWeek1Solutions() {
  const solutions = [
    printSolutions1,
    printSolutions2,
    printSolutions3,
    printSolutions4,
    printSolutions5,
    printSolutions6,
    printSolutions7
  ]
  solutions.forEach((sol, i) => printSolution(i + 1, sol));
}

function printWeek2Solutions() {
  const solutions = [
    printSolutions8,
    printSolutions9,
    printSolutions10,
    printSolutions11,
    printSolutions12,
    printSolutions13,
    printSolutions14
  ]
  solutions.forEach((sol, i) => printSolution(i + 8, sol));
}

function printWeek3Solutions() {
  const solutions = [
    printSolutions15,
    printSolutions16,
    printSolutions17,
    printSolutions18,
    printSolutions19
  ]
  solutions.forEach((sol, i) => printSolution(i + 15, sol));
}

export function printAllSolutions() {
  printWeek1Solutions();
  printWeek2Solutions();
  printWeek3Solutions();
}