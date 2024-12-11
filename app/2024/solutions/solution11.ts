import * as fs from 'fs';

function blink(stone: string): [string, string] | string {
  if(stone === '0') { return '1'; }
  if(stone.length % 2 === 0) {
    const leftPart = stone.slice(0, stone.length / 2);
    const rightPart = stone.slice(stone.length / 2, stone.length);
    return [
      `${+leftPart}`,
      `${+rightPart}`
    ];
  }
  return `${(+stone * 2024)}`;
}

const cache = new Map<string, number>();

function countStonesAfterBlinks(stone: string, blinksNumber: number): number {
  const cacheKey = `${stone}_${blinksNumber}`;
  const cachedVal = cache.get(cacheKey);
  if(cachedVal !== undefined) {
    return cachedVal;
  }
  if(blinksNumber === 0) {
    return 1;
  }
  const stones = blink(stone);
  if(typeof stones === 'string') {
    const result = countStonesAfterBlinks(stones, blinksNumber - 1);
    cache.set(cacheKey, result);
    return result;
  }
  const result = countStonesAfterBlinks(stones[0], blinksNumber - 1) + countStonesAfterBlinks(stones[1], blinksNumber - 1);
  cache.set(cacheKey, result);
  return result;
}

export function printSolutions11(): void {
  const stones = fs.readFileSync('./app/2024/res/input11.txt').toString().split(' ');
  const sum25 = stones.map(stone => countStonesAfterBlinks(stone, 25)).reduce((acc, val) => acc + val);
  const sum75 = stones.map(stone => countStonesAfterBlinks(stone, 75)).reduce((acc, val) => acc + val);
  console.log(sum25);
  console.log(sum75);
}
