import * as fs from 'fs';

const cardToValuePart1 = new Map<string, number>([
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["9", 9],
  ["T", 10],
  ["J", 11],
  ["Q", 12],
  ["K", 13],
  ["A", 14],
]);

const cardToValuePart2 = new Map<string, number>([
  ["J", 1],
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["9", 9],
  ["T", 10],
  ["Q", 12],
  ["K", 13],
  ["A", 14],
]);

class Card {
  private char: string;
  private cardValue: number;

  public constructor(char: string, cardValueMapping: Map<string, number>) {
    this.char = char;
    this.cardValue = cardValueMapping.get(this.char) ?? 0; // if 0 then there is a bug
  }

  public compare(other: Card): number {
    return this.cardValue - other.cardValue;
  }
}

type cardGroup = {char: string, count: number}

class Hand {
  private cards: Card[];
  private typeValuePart1: number;
  private typeValuePart2: number;
  public bid: number;

  constructor(handString: string, bid: number, cardValueMapping: Map<string, number>) {
    this.bid = bid;
    this.cards = handString.split("").map(c => new Card(c, cardValueMapping));
    this.typeValuePart1 = this.getHandTypeValue(handString);
    this.typeValuePart2 = this.getHandTypeValueWithJokers(handString);
  }

  public static fromInputLine(line: string, cardValueMapping: Map<string, number>): Hand {
    const parts = line.split(" ");
    return new Hand(parts[0], +parts[1], cardValueMapping);
  }

  private getHandTypeValue(handString: string): number {
    const groups = this.mapHandStringToMapOfGroups(handString);
    let groupsAsList: cardGroup[] = [];
    groups.forEach((val, key) => groupsAsList.push({char: key, count: val}));
    return this.mapGroupsOfCardsToTypeValue(groupsAsList, 0);
  }

  private getHandTypeValueWithJokers(handString: string): number {
    const groups = this.mapHandStringToMapOfGroups(handString);

    let jokersCount = groups.get("J") ?? 0;
    groups.set("J", 0);
    
    let groupsAsList: cardGroup[] = [];
    groups.forEach((val, key) => groupsAsList.push({char: key, count: val}));
    return this.mapGroupsOfCardsToTypeValue(groupsAsList, jokersCount);
  }

  private mapHandStringToMapOfGroups(handString: string): Map<string, number> {
    const groups = new Map<string, number>();
    
    handString.split("").forEach(c => {
      if(groups.has(c)) {
        groups.set(c, 1 + (groups.get(c) as number));
      } else {
        groups.set(c, 1);
      }
    });
    return groups;
  }

  private mapGroupsOfCardsToTypeValue(groups: cardGroup[], jokersCount: number): number { 
    groups.sort((a, b) => b.count - a.count);
    if(groups[0].count + jokersCount === 5) {
      return 7;
    }
    if(groups[0].count + jokersCount === 4) {
      return 6;
    }
    if(groups[0].count + jokersCount === 3) {
      if(groups[1].count === 2) {
        return 5;
      } else {
        return 4;
      }
    }
    if(groups[0].count + jokersCount === 2) {
      if(groups[1].count === 2) {
        return 3;
      }
      return 2;
    }
    return 1;
  }

  public comparePart1(other: Hand): number {
    return this.compare(this.typeValuePart1, other.typeValuePart1, other);
  }

  public comparePart2(other: Hand): number {
    return this.compare(this.typeValuePart2, other.typeValuePart2, other);
  }

  private compare(typeValue: number, otherTypeValue: number, other: Hand): number {
    if(typeValue !== otherTypeValue) {
      return typeValue - otherTypeValue;
    }
    return this.compareCards(other);
  }

  private compareCards(other: Hand): number {
    for(let i = 0; i < this.cards.length; i++) {
      const cardComparison = this.cards[i].compare(other.cards[i]);
      if(cardComparison !== 0) {
        return cardComparison;
      }
    }
    return 0;
  }

}

function parseInput(cardValueMapping: Map<string, number>): Hand[] {
  const inputContent = fs.readFileSync('./app/res/week1/input7.txt').toString();
  let inputLines = inputContent.split('\n');
  return inputLines.map(line => Hand.fromInputLine(line, cardValueMapping));
}

function sumWinnings(sortedHands: Hand[]): number {
  const winnings = sortedHands.map((hand, i) => hand.bid * (i + 1));
  return winnings.reduce((acc, n) => acc + n);
}

function printSolution7Part1() {
  const hands = parseInput(cardToValuePart1);
  hands.sort((a, b) => a.comparePart1(b));
  const totalWinnings = sumWinnings(hands);
  console.log(totalWinnings);
}

function printSolution7Part2() {
  const hands = parseInput(cardToValuePart2);
  hands.sort((a, b) => a.comparePart2(b));
  const totalWinnings = sumWinnings(hands);
  console.log(totalWinnings);
}

export function printSolutions7() {
  printSolution7Part1();
  printSolution7Part2();
}
