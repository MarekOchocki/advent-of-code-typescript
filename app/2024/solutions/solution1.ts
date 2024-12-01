import * as fs from 'fs';

function readInput(): [number[], number[]] {
  const inputContent = fs.readFileSync('./app/2024/res/input1.txt').toString();
  const leftList: number[] = [];
  const rightList: number[] = [];
  inputContent.split("\n").map(line => line.split("   ")).forEach(parts => {
    leftList.push(+parts[0]);
    rightList.push(+parts[1]);
  });
  leftList.sort((a, b) => a - b);
  rightList.sort((a, b) => a - b);
  return [leftList, rightList];
}

function printSolution1Part1() {
  const [list1, list2] = readInput();
  const sum = list1.reduce((prev, current, index) => prev + Math.abs(current - list2[index]), 0);
  console.log(sum);
}

function printSolution1Part2() {
  const [list1, list2] = readInput();
  const map2: Map<number, number> = new Map<number, number>();
  list2.forEach(el => map2.set(el, (map2.get(el) ?? 0) + 1));
  const sum = list1.reduce((prev, current) => prev + current * (map2.get(current) ?? 0), 0);
  console.log(sum);

}

export function printSolutions1(): void {
  printSolution1Part1();
  printSolution1Part2();
}