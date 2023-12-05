import * as fs from 'fs';

type Range = {start: number; length: number};

class MappingRangeEntry {
  constructor(public destinationStart: number, public sourceStart: number, public range: number) { }
}

class Mapping {
  private ranges: MappingRangeEntry[] = [];

  static fromInputLines(lines: string[]): Mapping {
    const result = new Mapping();
    result.ranges = lines.map(line => {
      const numbers = line.split(" ").map(n => +n);
      return new MappingRangeEntry(numbers[0], numbers[1], numbers[2]);
    });
    result.ranges.sort((a, b) => a.sourceStart - b.sourceStart);
    return result;
  }

  getValueFor(source: number): number {
    for(let i = 0; i < this.ranges.length; i++) {
      const range = this.ranges[i];
      if(source >= range.sourceStart && source < range.sourceStart + range.range) {
        return range.destinationStart + source - range.sourceStart;
      }
    }
    return source;
  }

  applyMapping(ranges: Range[]): Range[] {
    const mappedRanges: Range[] = [];
    ranges.forEach(range => {
      mappedRanges.push(...this.applyMappingForRange(range));
    });
    return mappedRanges;
  }
  
  private applyMappingForRange(range: Range): Range[] {
    const cutRanges = this.cutRange(range);
    return cutRanges.map(range => ({start: this.getValueFor(range.start), length: range.length}));
  }

  private cutRange(range: Range): Range[] {
    const resultRanges: Range[] = [];
    let currentSource = range;
    while(currentSource.length > 0) {
      const cuttingResult = this.cutNextRanges(currentSource);
      resultRanges.push(...cuttingResult.cutRanges);
      currentSource = cuttingResult.newSource;
    }
    return resultRanges;
  }

  private haveIntersection(a: Range, b: Range): boolean {
    return (a.start >= b.start && a.start < b.start + b.length) ||
    (b.start >= a.start && b.start < a.start + a.length);
  }

  private rangeIncludes(a: Range, b: Range): boolean {
    return a.start <= b.start && a.start + a.length >= b.start + b.length;
  }


  private cutNextRanges(sourceRange: Range): {newSource: Range, cutRanges: Range[]} {
    const rangeNearStart = this.findRangeForValue(sourceRange.start);

    if(!this.haveIntersection(sourceRange, rangeNearStart) || this.rangeIncludes(rangeNearStart, sourceRange)) {
      const cutRange = {start: sourceRange.start, length: sourceRange.length};
      const newSource = {start: 0, length: 0};
      return {newSource, cutRanges: [cutRange]};
    }

    if(this.rangeIncludes(sourceRange, rangeNearStart)) {
      const firstCutStart = sourceRange.start;
      const firstCutLength = rangeNearStart.start - firstCutStart;
      const secondCutStart = rangeNearStart.start;
      const secondCutLength = rangeNearStart.length;
      const newSourceStart = secondCutStart + secondCutLength;
      const newSourceLength = sourceRange.length - firstCutLength - secondCutLength;
      const newSource = {start: newSourceStart, length: newSourceLength};
      const firstCut = {start: firstCutStart, length: firstCutLength};
      const secondCut = {start: secondCutStart, length: secondCutLength};
      const cutRanges = [firstCut, secondCut].filter(c => c.length !== 0);
      return {newSource, cutRanges};
    }

    if(sourceRange.start >= rangeNearStart.start && sourceRange.start < rangeNearStart.start + rangeNearStart.length) {
      const start = sourceRange.start;
      const length = rangeNearStart.start + rangeNearStart.length - sourceRange.start;
      const cutRange = {start, length};
      const newSource = {start: sourceRange.start + length, length: sourceRange.length - length};
      return {newSource, cutRanges: [cutRange]};
    }

    const firstCutStart = sourceRange.start;
    const firstCutLength = rangeNearStart.start - firstCutStart;
    const secondCutStart = rangeNearStart.start;
    const secondCutLength = sourceRange.start + sourceRange.length - rangeNearStart.start;
    const newSource = {start: 0, length: 0};
    const firstCut = {start: firstCutStart, length: firstCutLength};
    const secondCut = {start: secondCutStart, length: secondCutLength};
    return {newSource, cutRanges: [firstCut, secondCut]};
  }

  private findRangeForValue(value: number): Range {
    for(let i = 0; i < this.ranges.length; i++) {
      const range = this.ranges[i];
      if(value < range.sourceStart) {
        return {start: range.sourceStart, length: range.range};
      }
      if(value >= range.sourceStart && value < range.sourceStart + range.range) {
        return {start: range.sourceStart, length: range.range};
      }
    }
    const range = this.ranges[this.ranges.length - 1];
    return {start: range.sourceStart, length: range.range};
  }
}

class ParsedInput {
  seeds: number[] = [];
  seedsRanges: Range[] = [];
  mappings: Mapping[] = [];

  constructor() {
    const inputContent = fs.readFileSync('./app/res/week1/input5.txt').toString();
    let inputSections = inputContent.split('\n\n');
    this.parseSeeds(inputSections.splice(0, 1)[0]);
    this.mappings = inputSections.map(s => this.parseMappingSection(s));
  }

  public getLocationForSeed(seed: number): number {
    let currentValue = seed;
    this.mappings.forEach(mapping => currentValue = mapping.getValueFor(currentValue));
    return currentValue;
  }

  public applyMappingToRanges(seedRanges: Range[]): Range[] {
    let currentRanges = seedRanges;
    this.mappings.forEach(mapping => currentRanges = mapping.applyMapping(currentRanges));
    return currentRanges;
  }

  private parseSeeds(seedsSection: string): void {
    this.seeds = seedsSection.split(": ")[1].split(" ").map(s => +s);
    for(let i = 0; i < this.seeds.length; i += 2) {
      this.seedsRanges.push({start: this.seeds[i], length: this.seeds[i + 1]});
    }
  }

  private parseMappingSection(section: string): Mapping {
    const lines = section.split("\n").slice(1);
    return Mapping.fromInputLines(lines);
  }
}

function printSolution5Part1() {
  const input = new ParsedInput();
  const locations = input.seeds.map(seed => input.getLocationForSeed(seed));
  locations.sort((a, b) => a - b);
  console.log(locations[0]);
}

function printSolution5Part2() {
  const input = new ParsedInput();
  const locationRanges = input.applyMappingToRanges(input.seedsRanges);
  locationRanges.sort((a, b) => a.start - b.start);
  console.log(locationRanges[0].start);
}

export function printSolutions5() {
  printSolution5Part1(); // 240320250
  printSolution5Part2(); // 28580589
}
