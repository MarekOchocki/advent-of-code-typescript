import * as fs from 'fs';

class QuadraticEquationSolver {
  public static solve(a: number, b: number, c: number): number[] {
    const deltaSqrt = Math.sqrt(b*b - 4*a*c);
    if(deltaSqrt < 0) { return []; }
    if(deltaSqrt === 0) { return [(-b) / (2 * a)]; }
    const lower = ((-b) - deltaSqrt) / (2 * a);
    const higher = ((-b) + deltaSqrt) / (2 * a);
    return [lower, higher];
  } 
}

class RaceInfo {
  constructor(public time: number, public recordDistance: number) { }

  getNumberOfWaysToWin(): number {
    const timeExtremes = QuadraticEquationSolver.solve(1, -this.time, this.recordDistance);
    if(timeExtremes.length !== 2) { return 0; }
    const lower = Number.isInteger(timeExtremes[0]) ? timeExtremes[0] + 1 : Math.ceil(timeExtremes[0]);
    const higher = Number.isInteger(timeExtremes[1]) ? timeExtremes[1] - 1 : Math.floor(timeExtremes[1]);
    return higher - lower + 1;
  }
}

function parseInput(): RaceInfo[] {
  const inputContent = fs.readFileSync('./app/res/week1/input6.txt').toString();
  let inputLines = inputContent.split('\n');
  inputLines = inputLines.map(line => line.replace(/\s+/g, ' ').split(": ")[1]);
  
  const times = inputLines[0].split(" ").map(n => +n);
  const records = inputLines[1].split(" ").map(n => +n);
  const races = times.map((t, i) => new RaceInfo(t, records[i]));
  return races;
}

function parseInputPart2(): RaceInfo {
  const inputContent = fs.readFileSync('./app/res/week1/input6.txt').toString();
  let inputLines = inputContent.split('\n');
  inputLines = inputLines.map(line => line.split(": ")[1].replace(/\s+/g, ''));
  
  const time = +inputLines[0];
  const record = +inputLines[1];
  return new RaceInfo(time, record);
}

function printSolution6Part1() {
  const races = parseInput();
  const waysToWin = races.map(race => race.getNumberOfWaysToWin());
  const result = waysToWin.reduce((acc, n) => acc * n);
  console.log(result);
}

function printSolution6Part2() {
  const race = parseInputPart2();
  console.log(race.getNumberOfWaysToWin());
}

export function printSolutions6() {
  printSolution6Part1();
  printSolution6Part2();
}
