
export class Vector3 {
  constructor(public x: number, public y: number, public z: number) { }

  public add(other: Vector3): Vector3 {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  public subtract(other: Vector3): Vector3 {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  public divide(divisor: number): Vector3 {
    return new Vector3(this.x / divisor, this.y / divisor, this.z / divisor);
  }

  public equals(other: Vector3): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }
}