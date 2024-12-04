import { printSolutions1 } from './solutions/solution1';
import { printSolutions2 } from './solutions/solution2';
import { printSolutions3 } from './solutions/solution3';
import { printSolutions4 } from './solutions/solution4';

function printSolution(day: number, solution: () => void): void {
  console.log(`\nDay ${day}`);
  solution();
}

export function printAll2024Solutions() {
  const solutions = [
    printSolutions1,
    printSolutions2,
    printSolutions3,
    printSolutions4
  ]
  console.log(`\n----------------- Edition 2024: `);
  solutions.forEach((sol, i) => printSolution(i + 1, sol));
}