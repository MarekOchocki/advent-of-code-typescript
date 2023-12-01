import { printSolutions1 } from './week1/solution1';

function printSolution(day: number, solution: () => void): void {
    console.log(`\nDay ${day}`);
    solution();
}

export function printWeek1Solutions() {
    let day = 1;
    printSolution(day, printSolutions1); day++;
}

export function printAllSolutions() {
    printWeek1Solutions();
}