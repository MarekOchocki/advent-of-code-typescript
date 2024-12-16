import { printSolutions1 } from './solutions/solution1';
import { printSolutions2 } from './solutions/solution2';
import { printSolutions3 } from './solutions/solution3';
import { printSolutions4 } from './solutions/solution4';
import { printSolutions5 } from './solutions/solution5';
import { printSolutions6 } from './solutions/solution6';
import { printSolutions7 } from './solutions/solution7';
import { printSolutions8 } from './solutions/solution8';
import { printSolutions9 } from './solutions/solution9';
import { printSolutions10 } from './solutions/solution10';
import { printSolutions11 } from './solutions/solution11';
import { printSolutions12 } from './solutions/solution12';
import { printSolutions13 } from './solutions/solution13';
import { printSolutions14 } from './solutions/solution14';
import { printSolutions15 } from './solutions/solution15';

function printSolution(day: number, solution: () => void): void {
  console.log(`\nDay ${day}`);
  solution();
}

export function printAll2024Solutions() {
  const solutions = [
    printSolutions1,
    printSolutions2,
    printSolutions3,
    printSolutions4,
    printSolutions5,
    printSolutions6,
    printSolutions7,
    printSolutions8,
    printSolutions9,
    printSolutions10,
    printSolutions11,
    printSolutions12,
    printSolutions13,
    printSolutions14,
    printSolutions15
  ]
  console.log(`\n----------------- Edition 2024: `);
  solutions.forEach((sol, i) => printSolution(i + 1, sol));
}