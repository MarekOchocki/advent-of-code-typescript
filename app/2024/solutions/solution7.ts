import * as fs from 'fs';

class CalibrationEquation {
  constructor(public testValue: number, private reversedNumbers: number[]) { }

  static fromInputString(line: string): CalibrationEquation {
    const parts = line.split(': ');
    const numbers = parts[1].split(' ').map(s => +s);
    return new CalibrationEquation(+parts[0], numbers.reverse());
  }

  canBeMadeTrue(useConcatenation: boolean): boolean {
    if(!Number.isInteger(this.testValue)) {
      return false;
    }
    if(this.reversedNumbers.length === 1) {
      return this.testValue === this.reversedNumbers[0];
    }
    const [first, ...rest] = this.reversedNumbers;

    const equations = [
      new CalibrationEquation(this.testValue - first, rest),
      new CalibrationEquation(this.testValue / first, rest)
    ];

    const testValAsString = `${this.testValue}`;
    const firstNumberAsString = `${first}`;
    if(useConcatenation && `${this.testValue}`.endsWith(firstNumberAsString)) {
      const reducedTestValue = testValAsString.substring(0, testValAsString.length - firstNumberAsString.length);
      equations.push(new CalibrationEquation(+reducedTestValue, rest));
    }

    return equations.some(eq => eq.canBeMadeTrue(useConcatenation));
  }
}

export function printSolutions7(): void {
  const inputLines = fs.readFileSync('./app/2024/res/input7.txt').toString().split('\n');
  const equations = inputLines.map(line => CalibrationEquation.fromInputString(line));
  const sum = equations.reduce((acc, value) => acc += value.canBeMadeTrue(false) ? value.testValue : 0, 0);
  console.log(sum);
  const sum2 = equations.reduce((acc, value) => acc += value.canBeMadeTrue(true) ? value.testValue : 0, 0);
  console.log(sum2);
}
