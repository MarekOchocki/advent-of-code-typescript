import * as fs from 'fs';

function canGroupStartAtPosition(record: string, group: number, index: number): boolean {
  if(record[index - 1] === "#") return false; // there is a group touching from the left side
  if(record.length < (group + index)) return false; // there is no room for the group
  if(record[index + group] === "#") return false; // there is a group touching from the right side
  for(let i = 0; i < group; i++) {
    if(record[index + i] === ".") return false; // there is an undamaged spring inside range for the group
  }
  return true;
}

class CacheMap {
  private resultMap = new Map<number, number>();
  private groupsNumber = 0;

  constructor(record: RecordLine) {
    this.groupsNumber = record.damagedSpringGroups.length;
  }

  public hasResult(recordPosition: number, groupsLengthLeft: number): boolean {
    return this.resultMap.has(this.getKey(recordPosition, groupsLengthLeft));
  }

  public getResult(recordPosition: number, groupsLengthLeft: number): number {
    return this.resultMap.get(this.getKey(recordPosition, groupsLengthLeft)) as number;
  }

  public cacheResult(recordPosition: number, groupsLengthLeft: number, result: number): void {
    this.resultMap.set(this.getKey(recordPosition, groupsLengthLeft), result);
  }

  private getKey(recordPosition: number, groupsLengthLeft: number): number {
    return recordPosition * this.groupsNumber + groupsLengthLeft;
  }
}

function getArrangementsNumber(record: string, damagedSpringGroups: number[], cacheMap: CacheMap): number {
  if(cacheMap.hasResult(record.length, damagedSpringGroups.length)) {
     return cacheMap.getResult(record.length, damagedSpringGroups.length)
  }
  let sum = 0;
  const [groupsHead, ...groupsTail] = damagedSpringGroups;
  for(let i = 0; i < record.length; i++) {
    if(canGroupStartAtPosition(record, groupsHead, i)) {
      const recordRest = record.slice(i + groupsHead + 1);
      if(groupsTail.length > 0) {
        sum += getArrangementsNumber(recordRest, groupsTail, cacheMap);
      } else {
        const isThereAnyDamagedSpringLeft = recordRest.includes("#"); 
        sum += isThereAnyDamagedSpringLeft ? 0 : 1;
      }
    }
    if(record[i] === "#") {
      break;
    }
  }
  cacheMap.cacheResult(record.length, damagedSpringGroups.length, sum);
  return sum;
}

class RecordLine {
  constructor(public record: string, public damagedSpringGroups: number[]) { }

  static fromInputLine(line: string): RecordLine {
    const parts = line.split(" ");
    const groups = parts[1].split(",").map(n => +n);
    return new RecordLine(parts[0], groups);
  }

  unfold(): RecordLine {
    const numberOfCopies = 5;
    const newRecord = new Array(numberOfCopies).fill("?").map(s => s + this.record).reduce((acc, s) => acc + s).slice(1);
    const newGroups = new Array(numberOfCopies).fill(0).map(_ => this.damagedSpringGroups).reduce((acc, g) => [...acc, ...g]);
    return new RecordLine(newRecord, newGroups);
  }
}

function parseInput(): RecordLine[] {
  const inputContent = fs.readFileSync('./app/res/week2/input12.txt').toString();
  return inputContent.split('\n').map(line => RecordLine.fromInputLine(line));
}

function getSumOfArrangements(records: RecordLine[]): number {
  const arrangements = records.map(r => getArrangementsNumber(r.record, r.damagedSpringGroups, new CacheMap(r)));
  return arrangements.reduce((acc, a) => acc + a);
}

function printSolutions12Part1() {
  const sum = getSumOfArrangements(parseInput());
  console.log(sum);
}

function printSolutions12Part2() {
  const records = parseInput().map(r => r.unfold());
  const sum = getSumOfArrangements(records);
  console.log(sum);
}

export function printSolutions12() {
  printSolutions12Part1();
  printSolutions12Part2();
}
