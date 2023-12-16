
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

  public equals(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public rotate(rotation: Rotation): Vector2 {
    if(rotation === Rotation.Clockwise) {
      return new Vector2(-this.y, this.x);
    }
    return new Vector2(this.y, -this.x);
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
}