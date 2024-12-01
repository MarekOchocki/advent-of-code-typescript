import { printSolutions22 } from './solutions/solution22';

function printSolution(day: number, solution: () => void): void {
  console.log(`\nDay ${day}`);
  solution();
}

export function printAll2021Solutions() {
  console.log(`\n----------------- Edition 2021: `);
  printSolution(22, printSolutions22);
}