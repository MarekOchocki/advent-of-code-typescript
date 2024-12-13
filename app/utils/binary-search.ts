
export interface InbeetweenBinarySearchResult {
  tooSmall: number;
  tooLarge: number;
}

export type BinarySearchResult = {
  type: 'valid';
  value: number;
} |
{
  type: 'moreThanMax' | 'lessThanMin';
} |
{
  type: 'inbetweenIntegers';
  value: InbeetweenBinarySearchResult;
}

export function binarySearchThroughIntegers(validMin: number, validMax: number, callback: (candidate: number) => number): BinarySearchResult {
  if(validMax <= validMin || !Number.isInteger(validMin) || !Number.isInteger(validMax)) {
    throw 'invalid binary search range arguments';
  }
  let currentCandidate = Math.floor((validMax - validMin + 1) / 2);
  let step = Math.ceil((currentCandidate - validMin) / 2);

  while(step >= 0.5) {
    const tmp = callback(currentCandidate);
    if(tmp === 0) {
      return {type: 'valid', value: currentCandidate};
    }
    currentCandidate += tmp > 0 ? step : -step;
    if(currentCandidate > validMax && step < 1) {
      return {type: 'moreThanMax'};
    }
    if(currentCandidate < validMin && step < 1) {
      return {type: 'lessThanMin'};
    }
    step = step > 2 ? Math.ceil(step / 2) : step / 2;
  }
  return {
    type: 'inbetweenIntegers',
    value: {
      tooSmall: Math.floor(currentCandidate),
      tooLarge: Math.ceil(currentCandidate)
    }
  };
}

export function binarySearchIndexInArray<T>(array: T[], callback: (element: T, index: number) => number): BinarySearchResult {
  return binarySearchThroughIntegers(0, array.length - 1, (index) => callback(array[index], index));
}