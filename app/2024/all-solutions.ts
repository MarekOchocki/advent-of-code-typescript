import { printSolutions1 } from './solutions/solution1';
import { printSolutions2 } from './solutions/solution2';
import { printSolutions3 } from './solutions/solution3';
import { printSolutions4 } from './solutions/solution4';
import { printSolutions5 } from './solutions/solution5';
import { printSolutions6 } from './solutions/solution6';
import { printSolutions7 } from './solutions/solution7';

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
    printSolutions7
  ]
  console.log(`\n----------------- Edition 2024: `);
  solutions.forEach((sol, i) => printSolution(i + 1, sol));
}