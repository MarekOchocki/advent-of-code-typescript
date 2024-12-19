import * as fs from 'fs';

function isDesignPossible(design: string, patterns: string[]): boolean {
  if(design.length === 0) {
    return true;
  }
  for(const pattern of patterns) {
    if(design.startsWith(pattern)) {
      if(isDesignPossible(design.slice(pattern.length), patterns)) {
        return true;
      }
    }
  }
  return false;
}

const cache = new Map<string, number>();

function inHowManyWaysCanBeMade(design: string, patterns: string[]): number {
  const cached = cache.get(design);
  if(cached !== undefined) return cached;
  if(design.length === 0) {
    return 1;
  }
  let result = 0;
  for(const pattern of patterns) {
    if(design.startsWith(pattern)) {
      result += inHowManyWaysCanBeMade(design.slice(pattern.length), patterns);
    }
  }
  cache.set(design, result);
  return result;
}

export function printSolutions19(): void {
  const input = fs.readFileSync('./app/2024/res/input19.txt').toString();
  const [ firstPart, secondPart ] = input.split('\n\n');
  const patterns = firstPart.split(', ');
  const designs = secondPart.split('\n');
  const howManyDesignsCanBeMade = designs.reduce((acc, design) => acc + (isDesignPossible(design, patterns) ? 1 : 0), 0);
  const possibilities = designs.reduce((acc, design) => acc + inHowManyWaysCanBeMade(design, patterns), 0);
  console.log(howManyDesignsCanBeMade);
  console.log(possibilities);
}