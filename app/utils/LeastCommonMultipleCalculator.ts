
export class LeastCommonMultipleCalculator {
  getLeastCommonMultipleForArray(numbers: number[]): number {
    let currentLCM = this.getLeastCommonMultiple(numbers[0], numbers[1]);
    for(let i = 2; i < numbers.length; i++) {
      currentLCM = this.getLeastCommonMultiple(currentLCM, numbers[i]);
    }
    return currentLCM;
  }

  getLeastCommonMultiple(first: number, second: number): number {
    const gcd = this.getGreatestCommonDivisor(first, second);
    return (first*second)/gcd;
  }

  getGreatestCommonDivisor(a: number, b: number): number {
    while(b !== 0) {
      let tmp = b;
      b = a % b;
      a = tmp;
    }
    return a;
  }
}