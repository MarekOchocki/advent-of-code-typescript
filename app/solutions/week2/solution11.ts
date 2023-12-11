import * as fs from 'fs';

class Galaxy {
  constructor(public x: number, public y: number) { }

  getShortestPath(other: Galaxy): number {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
  }
}

class MapPoint {
  constructor(public galaxyId: number) { }

  isEmpty(): boolean {
    return this.galaxyId === -1;
  }
}

class GalaxyMap {
  private galaxies: Galaxy[] = [];
  private sourceMap: MapPoint[][] = [];
  private sumOfShortestPathsBetweenGalaxies = 0;

  constructor(private expansionMultiplier: number) {
    const inputContent = fs.readFileSync('./app/res/week2/input11.txt').toString();
    this.fillSourceMapAndPrefillGalaxies(inputContent.split('\n'));
    this.moveGalaxiesAccordingToExpansion();
    this.sumOfShortestPathsBetweenGalaxies = this.findSumOfShortestPathsBetweenGalaxies();
  }

  public getSumOfShortestPathsBetweenGalaxies(): number {
    return this.sumOfShortestPathsBetweenGalaxies;
  }

  private findSumOfShortestPathsBetweenGalaxies(): number {
    let sum = 0;
    this.galaxies.forEach((galaxy1, currentIndex) => {
      for(let i = currentIndex + 1; i < this.galaxies.length; i++) {
        sum += galaxy1.getShortestPath(this.galaxies[i]);
      }
    });
    return sum;
  }

  private fillSourceMapAndPrefillGalaxies(inputLines: string[]) {
    const sourceMapAsChars = inputLines.map(line => line.split(""));
    for(let y = 0; y < inputLines.length; y++) {
      const currentLinePoints: MapPoint[] = [];
      for(let x = 0; x < inputLines[0].length; x++) {
        if(sourceMapAsChars[y][x] === ".") {
          currentLinePoints.push(new MapPoint(-1));
        } else {
          currentLinePoints.push(new MapPoint(this.galaxies.length));
          this.galaxies.push(new Galaxy(x, y));
        }
      }
      this.sourceMap.push(currentLinePoints);
    }
  }

  private moveGalaxiesAccordingToExpansion() {
    this.expandRowsBetweenGalaxies();
    this.expandColumnsBetweenGalaxies();
  }

  private expandRowsBetweenGalaxies(): void {
    let currentExpansion = 0;
    for(let y = 0; y < this.sourceMap.length; y++) {
      if(this.sourceMap[y].every(p => p.isEmpty())) {
        currentExpansion += this.expansionMultiplier - 1;
      } else {
        for(let x = 0; x < this.sourceMap[y].length; x++) {
          if(!this.sourceMap[y][x].isEmpty()) {
            this.galaxies[this.sourceMap[y][x].galaxyId].y += currentExpansion;
          }
        }
      }
    }
  }

  private expandColumnsBetweenGalaxies(): void {
    let currentExpansion = 0;
    for(let x = 0; x < this.sourceMap[0].length; x++) {
      if(this.isColumnEmpty(x)) {
        currentExpansion += this.expansionMultiplier - 1;
      } else {
        for(let y = 0; y < this.sourceMap.length; y++) {
          if(!this.sourceMap[y][x].isEmpty()) {
            this.galaxies[this.sourceMap[y][x].galaxyId].x += currentExpansion;
          }
        }
      }
    }
  }

  private isColumnEmpty(columnIndex: number): boolean {
    for(let y = 0; y < this.sourceMap.length; y++) {
      if(!this.sourceMap[y][columnIndex].isEmpty()) {
        return false;
      }
    }
    return true;
  }
}

function printSolution11Part1() {
  const map = new GalaxyMap(2);
  console.log(map.getSumOfShortestPathsBetweenGalaxies());
}

function printSolution11Part2() {
  const map = new GalaxyMap(1000000);
  console.log(map.getSumOfShortestPathsBetweenGalaxies());
}

export function printSolutions11() {
  printSolution11Part1();
  printSolution11Part2();
}