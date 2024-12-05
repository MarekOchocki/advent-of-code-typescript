import * as fs from 'fs';

class PageOrderingRule {
  constructor(public first: number, public second: number) { }

  public static fromString(str: string): PageOrderingRule {
    const parts = str.split('|');
    return new PageOrderingRule(+parts[0], +parts[1]);
  }

  public isCorrect(update: number[]): boolean {
    const firstIndex = update.findIndex(n => n === this.first);
    const secondIndex = update.findIndex(n => n === this.second);
    return firstIndex === -1 || secondIndex === -1 || firstIndex < secondIndex;
  }

  public isRelevantForUpdate(update: number[]): boolean {
    const firstIndex = update.findIndex(n => n === this.first);
    const secondIndex = update.findIndex(n => n === this.second);
    return firstIndex !== -1 && secondIndex !== -1;
  }
}

function findNextPageIndex(rules: PageOrderingRule[], update: number[], candidates: number[]): number {
  return candidates.findIndex(page => {
    return rules.every(rule => page !== rule.second || update.find(alreadyUsedPage => rule.first === alreadyUsedPage));
  });
}

function sortUpdate(rules: PageOrderingRule[], update: number[]): number[] {
  let relevantRules = rules.filter(rule => rule.isRelevantForUpdate(update));
  const correctUpdate: number[] = [];
  let pagesLeft = [...update];
  while(pagesLeft.length > 0) {
    const nextPageIndex = findNextPageIndex(relevantRules, correctUpdate, pagesLeft);
    correctUpdate.push(pagesLeft[nextPageIndex]);
    pagesLeft.splice(nextPageIndex, 1);
  }
  return correctUpdate;
}

function sumMiddleNumbers(updates: number[][]): number {
  const middleNumbers = updates.map(update => update[(update.length - 1) / 2]);
  return middleNumbers.reduce((prev, curr) => prev + curr);
}

export function printSolutions5(): void {
  const sections = fs.readFileSync('./app/2024/res/input5.txt').toString().split('\n\n');
  const rules = sections[0].split('\n').map(str => PageOrderingRule.fromString(str));
  const updates = sections[1].split('\n').map(str => str.split(',').map(n => +n));
  const correctUpdates = updates.filter(update => rules.every(rule => rule.isCorrect(update)));
  const incorrectUpdates = updates.filter(update => !rules.every(rule => rule.isCorrect(update)));
  const reorderedUpdates = incorrectUpdates.map(update => sortUpdate(rules, update));
  console.log(sumMiddleNumbers(correctUpdates));
  console.log(sumMiddleNumbers(reorderedUpdates));
}