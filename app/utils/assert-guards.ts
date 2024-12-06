
export function assertDefined<T>(val: T | undefined): asserts val is T {
  if(val === undefined) {
    throw 'value should not be undefined';
  }
}