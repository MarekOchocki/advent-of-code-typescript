import * as fs from 'fs';

class GameRecordEntry {
  public red: number = 0;
  public green: number = 0;
  public blue: number = 0;

  static fromGameEntryInput(entry: string): GameRecordEntry {
    const recordEntry = new GameRecordEntry();
    const cubeGroups = entry.split(',');
    cubeGroups.forEach(group => {
      const parts = group.split(' ');
      if(parts[2].startsWith('blue')) {
        recordEntry.blue = +parts[1];
      }
      if(parts[2].startsWith('green')) {
        recordEntry.green = +parts[1];
      }
      if(parts[2].startsWith('red')) {
        recordEntry.red = +parts[1];
      }
    });
    return recordEntry;
  }
}

class Game {
  public record: GameRecordEntry[] = [];

  constructor(public id: number) {
  }

  public getPower(): number {
    const minimumSetOfCubes = this.record.reduce((acc, entry) => {
      acc.red = Math.max(acc.red, entry.red);
      acc.green = Math.max(acc.green, entry.green);
      acc.blue = Math.max(acc.blue, entry.blue);
      return acc;
    });
    return minimumSetOfCubes.red * minimumSetOfCubes.green * minimumSetOfCubes.blue;
  }

  static fromInputLine(line: string): Game {
    const gameIdPart = line.split(':')[0];
    const result = new Game(+gameIdPart.slice(5));
    const entryStrings = line.split(':')[1].split(';');
    result.record = entryStrings.map(GameRecordEntry.fromGameEntryInput);
    return result;
  }
}

function parseInput(): Game[] {
  const inputContent = fs.readFileSync('./app/2023/res/input2.txt').toString();
  const inputLines = inputContent.split('\n');
  return inputLines.map(line => Game.fromInputLine(line));
}

function isGamePossible(game: Game, maxRed: number, maxGreen: number, maxBlue: number): boolean {
  for(let i = 0; i < game.record.length; i++) {
    const entry = game.record[i];
    if(entry.red > maxRed || entry.green > maxGreen || entry.blue > maxBlue) {
      return false;
    }
  }
  return true;
}

function printSolution2Part1() {
  const possibleGames = parseInput().filter(game => isGamePossible(game, 12, 13, 14));
  const sumOfIds = possibleGames.reduce((acc, game) => acc + game.id, 0);
  console.log(sumOfIds);
}

function printSolution2Part2() {
  const games = parseInput();
  const powers = games.map(game => game.getPower());
  const sum = powers.reduce((acc, power) => acc + power);
  console.log(sum);
}

export function printSolutions2() {
  printSolution2Part1();
  printSolution2Part2();
}