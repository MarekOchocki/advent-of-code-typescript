import * as fs from 'fs';

class DiskMapBlock {
  constructor(public length: number, public isFree: boolean, public id: number) {}
}

class DiskMap {
  private blocks: DiskMapBlock[] = [];
  
  constructor(data: string) {
    for(let i = 0; i < data.length; i++) {
      this.blocks.push(new DiskMapBlock(+data[i], i % 2 === 1, i % 2 === 1 ? -1 : Math.floor(i / 2)));
    }
  }

  asUnpackedData(): number[] {
    const result: number[] = [];
    for(let i = 0; i < this.blocks.length; i++) {
      for(let j = 0; j < this.blocks[i].length; j++) {
        result.push(this.blocks[i].id);
      }
    }
    return result;
  }

  reorderWithoutFragmentation(): void {
    let indexRight = this.blocks.length - 1;
    while(indexRight > 0) {
      if(this.blocks[indexRight].isFree) {
        indexRight--;
        continue;
      }
      const fileBlock = this.blocks[indexRight];
      const freeBlockIndex = this.findFreeBlockOfMinimalLength(fileBlock.length);
      if(freeBlockIndex === -1 || freeBlockIndex > indexRight) {
        indexRight--;
        continue;
      }

      const freeBlock = this.blocks[freeBlockIndex];

      if(fileBlock.length === freeBlock.length) {
        fileBlock.isFree = true;
        freeBlock.isFree = false;
        freeBlock.id = fileBlock.id;
        fileBlock.id = -1;
        indexRight--;
      } else
      if(fileBlock.length < freeBlock.length) {
        const newFreeBlock = new DiskMapBlock(freeBlock.length - fileBlock.length, true, -1);
        freeBlock.length -= newFreeBlock.length;
        this.blocks.splice(freeBlockIndex+1, 0, newFreeBlock);
        fileBlock.isFree = true;
        freeBlock.isFree = false;
        freeBlock.id = fileBlock.id;
        fileBlock.id = -1;
      }
    }
  }

  findFreeBlockOfMinimalLength(minLength: number): number {
    return this.blocks.findIndex(block => block.isFree && block.length >= minLength);
  }
}

function reorderAndFragmentDataInPlace(data: number[]) {
  let indexLeft = 0;
  let indexRight = data.length - 1;
  while(indexLeft < indexRight) {
    if(data[indexLeft] === -1) {
      data[indexLeft] = data[indexRight];
      data[indexRight] = -1;
      indexRight--;
      while(data[indexRight] === -1) {
        indexRight--;
      }
    }
    indexLeft++;
  }
}

function printSolutions9Part1(): void {
  const map = new DiskMap(fs.readFileSync('./app/2024/res/input9.txt').toString());
  const unpackedData = map.asUnpackedData();
  reorderAndFragmentDataInPlace(unpackedData);
  const checksumElements = unpackedData.map((n, index) => n === -1 ? 0 : n * index);
  const sum = checksumElements.reduce((acc, el) => acc + el);
  console.log(sum);
}

function printSolutions9Part2(): void {
  const map = new DiskMap(fs.readFileSync('./app/2024/res/input9.txt').toString());
  map.reorderWithoutFragmentation();
  const unpackedData = map.asUnpackedData();
  const checksumElements = unpackedData.map((n, index) => n === -1 ? 0 : n * index);
  const sum = checksumElements.reduce((acc, el) => acc + el);
  console.log(sum);
}


export function printSolutions9(): void {
  printSolutions9Part1();
  printSolutions9Part2();
}

