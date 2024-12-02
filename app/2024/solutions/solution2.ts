import * as fs from 'fs';

function readInput(): number[][] {
  const inputContent = fs.readFileSync('./app/2024/res/input2.txt').toString();
  return inputContent.split("\n").map(line => line.split(" ").map(str => +str));
}

function isSafe(report: number[]): boolean {
  const differences = report.slice(1).map((value, i) => value - report[i]);
  return differences.every(val => Math.abs(val) <= 3 && Math.abs(val) >= 1 && Math.sign(val) === Math.sign(differences[0]));
}

function createAllProblemDampenedReports(report: number[]): number[][] {
  return report.map((_, index) => {
    const tmp = [...report];
    tmp.splice(index, 1);
    return tmp;
  });
}

function isSafeWithProblemDampener(report: number[]): boolean {
  const dampenedReports = createAllProblemDampenedReports(report);
  return dampenedReports.some(report => isSafe(report));
}

function sumAllSafeReports(reports: number[][], safetyProtocol: (report: number[]) => boolean) {
  return reports.map(report => safetyProtocol(report)).reduce((accumulator, safe) => accumulator + (+safe), 0);
}

function printSolution2Part1() {
  const sum = sumAllSafeReports(readInput(), isSafe);
  console.log(sum);
}

function printSolution2Part2() {
  const sum = sumAllSafeReports(readInput(), isSafeWithProblemDampener);
  console.log(sum);
}

export function printSolutions2(): void {
  printSolution2Part1();
  printSolution2Part2();
}