import { printSolutions1 } from './week1/solution1';
import { printSolutions2 } from './week1/solution2';
import { printSolutions3 } from './week1/solution3';
import { printSolutions4 } from './week1/solution4';
import { printSolutions5 } from './week1/solution5';

function printSolution(day: number, solution: () => void): void {
    console.log(`\nDay ${day}`);
    solution();
}

export function printWeek1Solutions() {
    let day = 1;
    printSolution(day, printSolutions1); day++;
    printSolution(day, printSolutions2); day++;
    printSolution(day, printSolutions3); day++;
    printSolution(day, printSolutions4); day++;
    printSolution(day, printSolutions5); day++;
}

export function printAllSolutions() {
    printSolutions5();
}