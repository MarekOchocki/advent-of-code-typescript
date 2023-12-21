import { Vector2 } from "./Vector2";

export class Matrix<T> {
  private size = new Vector2(0, 0);
  private constructor(private elements: T[][]) {
    if(this.elements.length > 0)
      this.size = new Vector2(this.elements[0].length, this.elements.length);
  }

  static fromString<T>(str: string, elementConstructor: (c: string) => T): Matrix<T> {
    const elements = str.split("\n").map(line => line.split("").map(c => elementConstructor(c)));
    return new Matrix<T>(elements);
  }

  static from2DArray<T>(elements: T[][]): Matrix<T> {
    return new Matrix<T>(elements);
  }

  isInside(position: Vector2): boolean {
    return position.x >= 0 && position.x < this.size.x && position.y >= 0 && position.y < this.size.y;
  }

  getSize(): Vector2 {
    return this.size;
  }

  get(position: Vector2): T | undefined {
    if(position.y >= this.elements.length || position.y < 0) {
      return undefined;
    }
    return this.elements[position.y][position.x];
  }

  getLine(y: number): T[] {
    return this.elements[y] ?? [];
  }

  forEachInColumn(column: number, callback: (t: T) => void): void {
    for(let i = 0; i < this.elements.length; i++) {
      callback(this.elements[i][column]);
    }
  }

  forEach(callback: (t: T, position: Vector2) => void): void {
    this.elements.forEach((line, y) => line.forEach((el, x) => callback(el, new Vector2(x, y))));
  }
  
  map<R>(callback: (t: T) => R): R[][] {
    return this.elements.map(line => line.map(el => callback(el)));
  }
}

export interface Copyable<T> {
  copy(): T;
}

export function copyMatrix<T extends Copyable<T>>(matrix: Matrix<T>): Matrix<T> {
  const elementsCopy: T[][] = [];
  const size = matrix.getSize();
  for(let y = 0; y < size.y; y++) {
    elementsCopy.push([]);
    for(let x = 0; x < size.x; x++) {
      const element = matrix.get(new Vector2(x, y)) as T;
      elementsCopy[elementsCopy.length - 1].push(element.copy());
    }
  }
  return Matrix.from2DArray(elementsCopy);
}