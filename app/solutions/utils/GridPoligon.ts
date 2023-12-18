import { Vector2 } from "./Vector2";

export class GridPoligonSide {
  constructor(public direction: Vector2, public length: number) { }
}

export class GridPoligon {
  perimeter: number = 0;
  area: number = 0;

  constructor(private startPoint: Vector2, private sides: GridPoligonSide[]) {
    this.perimeter = this.calculatePerimeter();
    this.area = this.calculateArea();
  }

  private calculateArea(): number {
    let shoelaceFormulaResult = 0;
    let currentHeight = this.startPoint.y;
    this.sides.forEach(side => {
      shoelaceFormulaResult += currentHeight * side.length * side.direction.x;
      currentHeight += side.length * side.direction.y;
    });
    shoelaceFormulaResult = Math.abs(shoelaceFormulaResult);
    return shoelaceFormulaResult - this.perimeter / 2 + 1;
  }

  private calculatePerimeter(): number {
    return this.sides.reduce((acc, side) => acc + side.length, 0);
  }
}