import * as fs from 'fs';
import { Matrix } from '../../utils/Matrix';
import { Vector2 } from '../../utils/Vector2';

class GardenPlot {
  public areaId = -1;
  constructor(public readonly type: string) { }
}

class RegionProperties {
  public area = 0;
  public perimeter = 0;
}

class Garden {
  private gardenGrid: Matrix<GardenPlot>;
  private numberOfAreas = 0;

  constructor(input: string) {
    this.gardenGrid = Matrix.fromString(input, c => new GardenPlot(c));
    this.markAreas();
  }

  countFullPrice(): number {
    const regionPropertiesMap: RegionProperties[] = Array(this.numberOfAreas).fill(0).map(_ => new RegionProperties());
    this.gardenGrid.forEach((plot, position) => {
      regionPropertiesMap[plot.areaId].area++;
      Vector2.forEachDirection(direction => {
        const neighborPosition = position.add(direction);
        const neighbor = this.gardenGrid.get(neighborPosition);
        if(!neighbor || neighbor.type !== plot.type) {
          regionPropertiesMap[plot.areaId].perimeter++;
        }
      });
    });
    return regionPropertiesMap.reduce((acc, prop) => acc + prop.area * prop.perimeter, 0);
  }

  countDiscountedPrice(): number {
    const regionPropertiesMap: RegionProperties[] = Array(this.numberOfAreas).fill(0).map(_ => new RegionProperties());
    this.gardenGrid.forEach(plot => regionPropertiesMap[plot.areaId].area++);
    this.countHorizontalPerimeters(regionPropertiesMap);
    this.countVerticalPerimeters(regionPropertiesMap);
    return regionPropertiesMap.reduce((acc, prop) => acc + prop.area * prop.perimeter, 0);
  }

  private countHorizontalPerimeters(regionPropertiesMap: RegionProperties[]): void {
    const gardenSize = this.gardenGrid.getSize();
    for(let y = 0; y < gardenSize.y + 1; y++) {
      let prevIdUp: number | undefined;
      let prevIdBot: number | undefined;
      for(let x = 0; x < gardenSize.x; x++) {
        const idBot = this.gardenGrid.get(new Vector2(x, y))?.areaId;
        const idUp = this.gardenGrid.get(new Vector2(x, y - 1))?.areaId;
        if(idBot !== idUp) {
          if((idBot !== prevIdBot || idBot === prevIdUp) && idBot !== undefined) {
            regionPropertiesMap[idBot].perimeter++;
          }
          if((idUp !== prevIdUp || idUp === prevIdBot) && idUp !== undefined) {
            regionPropertiesMap[idUp].perimeter++;
          }
        }
        prevIdBot = idBot;
        prevIdUp = idUp;
      }
    }
  }

  private countVerticalPerimeters(regionPropertiesMap: RegionProperties[]): void {
    const gardenSize = this.gardenGrid.getSize();
    for(let x = 0; x < gardenSize.x + 1; x++) {
      let prevIdLeft: number | undefined;
      let prevIdRight: number | undefined;
      for(let y = 0; y < gardenSize.y; y++) {
        const idRight = this.gardenGrid.get(new Vector2(x, y))?.areaId;
        const idLeft = this.gardenGrid.get(new Vector2(x - 1, y))?.areaId;
        if(idRight !== idLeft) {
          if((idRight !== prevIdRight || idRight === prevIdLeft) && idRight !== undefined) {
            regionPropertiesMap[idRight].perimeter++;
          }
          if((idLeft !== prevIdLeft || idLeft === prevIdRight) && idLeft !== undefined) {
            regionPropertiesMap[idLeft].perimeter++;
          }
        }
        prevIdRight = idRight;
        prevIdLeft = idLeft;
      }
    }
  }

  private markAreas() {
    let nextAreaId = 0;
    this.gardenGrid.forEach((plot, position) => {
      if(plot.areaId === -1) {
        this.markAreaWithId(position, nextAreaId, plot.type);
        nextAreaId++;
      }
    });
    this.numberOfAreas = nextAreaId;
  }

  private markAreaWithId(position: Vector2, id: number, type: string) {
    const plot = this.gardenGrid.get(position);
    if(!plot || plot.areaId !== -1 || plot.type !== type) {
      return;
    }
    plot.areaId = id;
    Vector2.forEachDirection(direction => this.markAreaWithId(position.add(direction), id, type));
  }
}

export function printSolutions12(): void {
  const input = fs.readFileSync('./app/2024/res/input12.txt').toString();
  const garden = new Garden(input);
  console.log(garden.countFullPrice());
  console.log(garden.countDiscountedPrice());
}
