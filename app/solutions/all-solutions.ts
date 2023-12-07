import { printSolutions1 } from './week1/solution1';
import { printSolutions2 } from './week1/solution2';
import { printSolutions3 } from './week1/solution3';
import { printSolutions4 } from './week1/solution4';
import { printSolutions5 } from './week1/solution5';
import { printSolutions6 } from './week1/solution6';
import { printSolutions7 } from './week1/solution7';

function printSolution(day: number, solution: () => void): void {
    console.log(`\nDay ${day}`);
    solution();
}

export function printWeek1Solutions() {
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

export function printAllSolutions() {
    printWeek1Solutions();
}