import * as fs from 'fs';

class EngineNumber {
  constructor(public row: number, public startPos: number, public endPos: number, public value: number) { }
}

class EngineGear {
  private adjacentNumbers: EngineNumber[] = [];
  private ratio = 0;

  constructor(public row: number, public column: number) { }

  public addNumber(engineNumber: EngineNumber) {
    this.adjacentNumbers.push(engineNumber);
    if(this.adjacentNumbers.length === 2) {
      this.ratio = this.adjacentNumbers[0].value * this.adjacentNumbers[1].value;
    } else {
      this.ratio = 0;
    }
  }

  public getGearRatio() {
    return this.ratio;
  }
}

function isDigit(char: string): boolean {
  return char.charCodeAt(0) >= "0".charCodeAt(0) && char.charCodeAt(0) <= "9".charCodeAt(0)
}

function hasSpecialCharAdjacent(lines: string[], column: number, row: number): boolean {
  for(let x = column - 1; x < column + 2; x++) {
    for(let y = row - 1; y < row + 2; y++) {
      if(lines[y] === undefined || lines[y][x] === undefined) {
        continue;
      }
      if(lines[y][x] !== "." && !isDigit(lines[y][x])) {
        return true;
      }
    }
  }
  return false;
}

function getAdjacentGearPositions(lines: string[], number: EngineNumber): {x: number, y: number}[] {
  const result: {x: number, y: number}[] = [];
  for(let x = number.startPos - 1; x < number.endPos + 2; x++) {
    for(let y = number.row - 1; y < number.row + 2; y++) {
      if(lines[y] === undefined || lines[y][x] === undefined) {
        continue;
      }
      if(lines[y][x] === "*") {
        result.push({x, y});
      }
    }
  }
  return result;
}

function findEngineNumbers(lines: string[], index: number): EngineNumber[] {
  const line = lines[index];
  let numbers: EngineNumber[] = [];
  let tmpSum = 0;
  let tmpNumberLen = 0;
  let hasSpecialChar = false;
  for(let i = 0; i < line.length; i++) {
    if(isDigit(line[i])) {
      tmpSum *= 10;
      tmpSum += +line[i];
      tmpNumberLen++;
      hasSpecialChar = hasSpecialChar || hasSpecialCharAdjacent(lines, i, index);
      if(i !== line.length - 1) {
        continue;
      }
    }
    if(hasSpecialChar) {
      numbers.push(new EngineNumber(index, i - tmpNumberLen, i - 1, tmpSum));
    }
    tmpNumberLen = 0;
    hasSpecialChar = false;
    tmpSum = 0;
  }
  return numbers;
}

function findGears(lines: string[]): EngineGear[] {
  const gears: EngineGear[] = [];
  for(let y = 0; y < lines.length; y++) {
    for(let x = 0; x < lines[y].length; x++) {
      if(lines[y][x] === '*') {
        gears.push(new EngineGear(y, x));
      }
    }
  }
  return gears;
}

function printSolution3Part1() {
  const inputContent = fs.readFileSync('./app/res/week1/input3.txt').toString();
  const inputLines = inputContent.split('\n');
  const engineNumbers = inputLines.map((_, i) => findEngineNumbers(inputLines, i)).reduce((acc, numbers) => acc = [...acc, ...numbers]);
  const sumOfEngineNumbers = engineNumbers.reduce((acc, number) => acc + number.value, 0);
  console.log(sumOfEngineNumbers);
}

function printSolution3Part2() {
  const inputContent = fs.readFileSync('./app/res/week1/input3.txt').toString();
  const inputLines = inputContent.split('\n');
  const engineNumbers = inputLines.map((_, i) => findEngineNumbers(inputLines, i)).reduce((acc, numbers) => acc = [...acc, ...numbers]);
  const engineGears = findGears(inputLines);

  engineNumbers.forEach(engineNumber => {
    const gearPositions = getAdjacentGearPositions(inputLines, engineNumber);
    gearPositions.forEach(position => {
      const gear = engineGears.find(g => g.column === position.x && g.row === position.y);
      gear?.addNumber(engineNumber);
    });
  });

  const sumOfGearRatios = engineGears.reduce((acc, gear) => acc + gear.getGearRatio(), 0);
  console.log(sumOfGearRatios); // 75847567
}

export function printSolutions3() {
  printSolution3Part1();
  printSolution3Part2();
}