
export enum Rotation {
  Clockwise,
  Counterclockwise
}

export class Vector2 {
  constructor(public x: number, public y: number) { }

  public add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  public subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  public divide(divisor: number): Vector2 {
    return new Vector2(this.x / divisor, this.y / divisor);
  }

  public equals(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public rotate(rotation: Rotation): Vector2 {
    if(rotation === Rotation.Clockwise) {
      return new Vector2(-this.y, this.x);
    }
    return new Vector2(this.y, -this.x);
  }

  public reverse(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  public static Right(): Vector2 {
    return new Vector2(1, 0);
  }

  public static Left(): Vector2 {
    return new Vector2(-1, 0);
  }

  public static Up(): Vector2 {
    return new Vector2(0, -1);
  }

  public static Down(): Vector2 {
    return new Vector2(0, 1);
  }

  public static forEach(callback: (direction: Vector2) => void): void {
    callback(Vector2.Up());
    callback(Vector2.Right());
    callback(Vector2.Down());
    callback(Vector2.Left());
  }
}