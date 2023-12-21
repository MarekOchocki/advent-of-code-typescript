import * as fs from 'fs';
import { Copyable, Matrix, copyMatrix } from '../utils/Matrix';
import { Vector2 } from '../utils/Vector2';

enum TileType {
  Start = "S",
  GardenPlot = ".",
  Rock = "#"
}

class Tile implements Copyable<Tile> {
  distance: number = -1;
  type: TileType = TileType.GardenPlot;

  constructor(inputChar: string) {
    if(inputChar === TileType.Rock) {
      this.type = TileType.Rock;
    } else if(inputChar === TileType.Start) {
      this.type = TileType.Start;
    }
  }

  copy(): Tile {
    const result = new Tile(this.type);
    result.distance = this.distance;
    return result;
  }
}

type ParsedInput = { map: Matrix<Tile>; startPosition: Vector2; };

function parseInput(): ParsedInput {
  const inputContent = fs.readFileSync('./app/res/week3/input21.txt').toString();
  const map = Matrix.fromString(inputContent, c => new Tile(c));
  let middlePoint = map.getSize().subtract(new Vector2(1, 1)).divide(2);
  return {map, startPosition: middlePoint};
}

function makeNextValidPositions(map: Matrix<Tile>, source: Vector2): Vector2[] {
  const nextPositions: Vector2[] = [];
  Vector2.forEach(direction => {
    const position = source.add(direction);
    const tile = map.get(position);
    if(tile === undefined || tile.type === TileType.Rock) return;
    nextPositions.push(position);
  });
  return nextPositions;
}

function checkPosition(map: Matrix<Tile>, position: Vector2, currentDistance: number): Vector2[] {
  const tile = map.get(position) as Tile; // steps are guaranteed to lead to valid positions
  if(tile.distance > -1) { return []; }
  tile.distance = currentDistance;
  return makeNextValidPositions(map, position);
}

function calculateDistance(map: Matrix<Tile>, startPosition: Vector2, startDistance: number): void {
  let positionsToCheck: Vector2[] = [startPosition];
  let currentDistance = startDistance;

  while(positionsToCheck.length !== 0) {
    const newPositions: Vector2[] = [];

    positionsToCheck.forEach(position => {
      newPositions.push(...checkPosition(map, position, currentDistance));
    });

    positionsToCheck = newPositions;
    currentDistance++;
  }
}

function getNumberOfTilesThatCanBeReachedIn(stepsNumber: number, map: Matrix<Tile>): number {
  let result = 0;
  map.forEach(tile => {
    if(tile.distance <= stepsNumber && (tile.distance % 2) === (stepsNumber % 2)) {
      result++;
    }
  });
  return result;
}

function getHowManyTimesIsTileReachableSideCase(stepsNumber: number, distance: number, repeatCycle: number): number {
  if(distance === -1) return 0;
  if(distance > stepsNumber) return 0;
  if((distance % 2) !== (stepsNumber % 2)) {
    distance += repeatCycle;
  }
  if(distance > stepsNumber) return 0;
  const difference = stepsNumber - distance;
  const repeats = Math.floor(difference / (repeatCycle * 2));
  return 1 + repeats;
}

function getHowManyTimesIsTileReachableCornerCase(stepsNumber: number, distance: number, repeatCycle: number): number {
  if(distance === -1) return 0;
  if((distance % 2) !== (stepsNumber % 2)) {
    distance += repeatCycle;
    if(distance > stepsNumber) return 0;

    const difference = stepsNumber - distance;
    const repeats = Math.floor(difference / (repeatCycle * 2));
    const timesApplied = repeats + 1;
    const numberOfLastDiagonalMaps = 2 + 2 * (timesApplied - 1);
    const sumOfArithmeticSequence = ((2 + numberOfLastDiagonalMaps)/2) * timesApplied;
    return sumOfArithmeticSequence;
  } else {
    if(distance > stepsNumber) return 0;
    const difference = stepsNumber - distance;
    const repeats = Math.floor(difference / (repeatCycle * 2));
    const timesApplied = repeats + 1;
    const numberOfLastDiagonalMaps = 1 + 2 * (timesApplied - 1);
    const sumOfArithmeticSequence = ((1 + numberOfLastDiagonalMaps)/2) * timesApplied;
    return sumOfArithmeticSequence;
  }
}

function getReachableTilesOnInfiniteMapSides(stepsNumber: number, map: Matrix<Tile>, repeatCycle: number): number {
  let result = 0;
  map.forEach(tile => {
    result += getHowManyTimesIsTileReachableSideCase(stepsNumber, tile.distance, repeatCycle);
  });
  return result;
}

function getReachableTilesOnInfiniteMapCorners(stepsNumber: number, map: Matrix<Tile>, repeatCycle: number): number {
  let result = 0;
  map.forEach(tile => {
    result += getHowManyTimesIsTileReachableCornerCase(stepsNumber, tile.distance, repeatCycle);
  });
  return result;
}

function printSolution21Part1() {
  const stepsNumber = 64;
  const {map, startPosition} = parseInput();
  calculateDistance(map, startPosition, 0);
  const result = getNumberOfTilesThatCanBeReachedIn(stepsNumber, map);
  console.log(result);
}

// input assumption: sides x and y have the same length
// input assumption: start tile is in the middle
// assumption about input: straight paths from the starting point to borders are unobstructed 
function printSolution21Part2() {
  const stepsNumber = 26501365;
  const {map, startPosition} = parseInput();
  const mapEast = copyMatrix(map);
  const mapWest = copyMatrix(map);
  const mapNorth = copyMatrix(map);
  const mapSouth = copyMatrix(map);

  const mapNE = copyMatrix(map);
  const mapSE = copyMatrix(map);
  const mapNW = copyMatrix(map);
  const mapSW = copyMatrix(map);

  const distanceFromMiddleToSide = (map.getSize().x - 1) / 2

  calculateDistance(map, startPosition, 0);
  calculateDistance(mapEast, new Vector2(0, startPosition.y), distanceFromMiddleToSide + 1);
  calculateDistance(mapWest, new Vector2(map.getSize().x - 1, startPosition.y), distanceFromMiddleToSide + 1);
  calculateDistance(mapSouth, new Vector2(startPosition.x, 0), distanceFromMiddleToSide + 1);
  calculateDistance(mapNorth, new Vector2(startPosition.x, map.getSize().y - 1), distanceFromMiddleToSide + 1);
  
  calculateDistance(mapNE, new Vector2(0, map.getSize().y - 1), 2 * (distanceFromMiddleToSide + 1));
  calculateDistance(mapSE, new Vector2(0, 0), 2 * (distanceFromMiddleToSide + 1));
  calculateDistance(mapNW, new Vector2(map.getSize().x - 1, map.getSize().y - 1), 2 * (distanceFromMiddleToSide + 1));
  calculateDistance(mapSW, new Vector2(map.getSize().x - 1, 0), 2 * (distanceFromMiddleToSide + 1));

  let result = getNumberOfTilesThatCanBeReachedIn(stepsNumber, map);
  result += getReachableTilesOnInfiniteMapSides(stepsNumber, mapEast, map.getSize().x);
  result += getReachableTilesOnInfiniteMapSides(stepsNumber, mapWest, map.getSize().x);
  result += getReachableTilesOnInfiniteMapSides(stepsNumber, mapNorth, map.getSize().y);
  result += getReachableTilesOnInfiniteMapSides(stepsNumber, mapSouth, map.getSize().y);

  result += getReachableTilesOnInfiniteMapCorners(stepsNumber, mapNE, map.getSize().x);
  result += getReachableTilesOnInfiniteMapCorners(stepsNumber, mapSE, map.getSize().x);
  result += getReachableTilesOnInfiniteMapCorners(stepsNumber, mapNW, map.getSize().x);
  result += getReachableTilesOnInfiniteMapCorners(stepsNumber, mapSW, map.getSize().x);
  console.log(result);
}

export function printSolutions21() {
  printSolution21Part1();
  printSolution21Part2();
}
