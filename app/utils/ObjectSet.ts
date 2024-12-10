import { Stringifiable } from "./interfaces/stringifiable.interface";

export class ObjectSet<T extends Stringifiable> {
  private map = new Map<string, T>();

  add(obj: T): void {
    this.map.set(obj.asString(), obj);
  }

  addFrom(set: ObjectSet<T>): void {
    for(const [key, obj] of set.map.entries()) {
      this.map.set(key, obj);
    }
  }

  size(): number {
    return this.map.size;
  }

  has(obj: T): boolean {
    return this.map.has(obj.asString());
  }

  clear(): void {
    this.map.clear();
  }

  delete(obj: T): void {
    this.map.delete(obj.asString());
  }

  values(): MapIterator<T> {
    return this.map.values();
  }

  forEach(callback: (obj: T) => void): void {
    this.map.forEach(callback);
  }

  reduce<U>(callbackfn: (previousValue: U, currentValue: T) => U, initialValue: U): U {
    let currentAccumulator = initialValue;
    this.forEach((value) => {
      currentAccumulator = callbackfn(currentAccumulator, value);
    });
    return currentAccumulator;
  }
}