import * as fs from 'fs';

class ScratchCard {
  private points = 0;
  private matchingNumbers = 0;

  constructor(winningNumbers: number[], elfsNumbers: number[]) {
    const elfsNumbersAsSet = new Set<number>(elfsNumbers);
    const intersetion = winningNumbers.filter(w => elfsNumbersAsSet.has(w));
    this.matchingNumbers = intersetion.length;
    if(this.matchingNumbers !== 0) {
      this.points = Math.pow(2, this.matchingNumbers - 1);
    }
  }

  getPoints(): number {
    return this.points;
  }

  getNumberOfMatchingNumbers(): number {
    return this.matchingNumbers;
  }

  static fromLine(line: string): ScratchCard {
    const numbersString = line.split(':')[1];
    const winningNumbersString = numbersString.split(' |')[0];
    const elfsNumbersString = numbersString.split(' |')[1];
    const winningNumbersParsed = ScratchCard.parseNumbersString(winningNumbersString);
    const elfsNumbersParsed = ScratchCard.parseNumbersString(elfsNumbersString);
    return new ScratchCard(winningNumbersParsed, elfsNumbersParsed);
  }

  static parseNumbersString(str: string): number[] {
    const result: number[] = [];
    for(let i = 1; i < str.length; i += 3) {
      result.push(+str.substring(i, i + 2));
    }
    return result;
  }
}

class GroupOfIdenticalCards {
  constructor(private originalCard: ScratchCard, private groupSize: number) { }

  getSumOfPoints(): number {
    return this.originalCard.getPoints() * this.groupSize;
  }

  getSize(): number {
    return this.groupSize;
  }

  addCards(numberOfCards: number): void {
    this.groupSize += numberOfCards;
  }

  getNumberOfMatchingNumbers(): number {
    return this.originalCard.getNumberOfMatchingNumbers();
  }
}

function insertCardsCopies(cards: GroupOfIdenticalCards[]) {
  for(let i = 0; i < cards.length; i++) {
    for(let j = i + 1; j < i + 1 + cards[i].getNumberOfMatchingNumbers(); j++) {
      cards[j].addCards(cards[i].getSize());
    }
  }
}

function printSolution4Part1() {
  const inputContent = fs.readFileSync('./app/res/week1/input4.txt').toString();
  const inputLines = inputContent.split('\n');
  const cards = inputLines.map(ScratchCard.fromLine);
  const sum = cards.reduce((acc, card) => acc + card.getPoints(), 0);
  console.log(sum);
}

function printSolution4Part2() {
  const inputContent = fs.readFileSync('./app/res/week1/input4.txt').toString();
  const inputLines = inputContent.split('\n');
  const cards = inputLines.map(ScratchCard.fromLine).map(card => new GroupOfIdenticalCards(card, 1));
  insertCardsCopies(cards);
  const sum = cards.reduce((acc, card) => acc + card.getSize(), 0);
  console.log(sum);
}

export function printSolutions4() {
  printSolution4Part1();
  printSolution4Part2();
}
