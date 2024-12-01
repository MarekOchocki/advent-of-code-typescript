import * as fs from 'fs';
import { Matrix } from '../../utils/Matrix';
import { Rotation, Vector2 } from '../../utils/Vector2';
import { Heap } from 'heap-js';

class Tile {
  heatLoss: number;
  private visits: { timesStraight: number; direction: Vector2; }[] = [];

  constructor(tileChar: string) {
    this.heatLoss = +tileChar;
  }

  hasBeenVisited(timesStraight: number, direction: Vector2): boolean {
    return this.visits.some(v => v.timesStraight === timesStraight && v.direction.equals(direction));
  }

  visit(timesStraight: number, direction: Vector2): void {
    this.visits.push({timesStraight, direction});
  }
}

class Step {
  public currentPosition: Vector2;
  constructor(
    public inputHeatLoss: number,
    public startPosition: Vector2,
    public timesStraight: number,
    public movementDirection: Vector2
    ) {
      this.currentPosition = startPosition.add(movementDirection);
    }

  public compare(other: Step): number {
    return (this.inputHeatLoss - other.inputHeatLoss) ;
  }
}

function parseInput(): Matrix<Tile> {
  const inputContent = fs.readFileSync('./app/2023/res/input17.txt').toString();
  return Matrix.fromString(inputContent, c => new Tile(c));
}

function makeValidMovesForStandardCrucible(step: Step): Vector2[] {
  let validDirections: Vector2[] = [
    step.movementDirection.rotate(Rotation.Clockwise),
    step.movementDirection.rotate(Rotation.Counterclockwise)
  ];
  if(step.timesStraight < 3) { validDirections.push(step.movementDirection); }
  return validDirections;
}

function makeValidMovesForUltraCrucible(step: Step): Vector2[] {
  if(step.timesStraight < 4) {
    return [step.movementDirection];
  }
  let validDirections: Vector2[] = [
    step.movementDirection.rotate(Rotation.Clockwise),
    step.movementDirection.rotate(Rotation.Counterclockwise)
  ];
  if(step.timesStraight < 10) { validDirections.push(step.movementDirection); }
  return validDirections;
}

function makeNextValidSteps(map: Matrix<Tile>, step: Step, makeValidMoves: (step: Step) => Vector2[]): Step[] {
  const tile = map.get(step.currentPosition) as Tile; // steps are guaranteed to lead to valid positions
  const newHeatLoss = tile.heatLoss + step.inputHeatLoss;
  const nextSteps: Step[] = [];
  const validDirections = makeValidMoves(step);

  validDirections.forEach(direction => {
    const newPosition = step.currentPosition.add(direction);
    if(!map.isInside(newPosition)) { return; }
    const nextTile = map.get(newPosition) as Tile;
    const timesStraight = step.movementDirection.equals(direction) ? step.timesStraight + 1 : 1;
    if(nextTile.hasBeenVisited(timesStraight, direction)) { return; }
    nextSteps.push(new Step(newHeatLoss, step.currentPosition, timesStraight, direction));
  });

  return nextSteps;
}

function makeStep(map: Matrix<Tile>, step: Step, makeValidMoves: (step: Step) => Vector2[]): Step[] {
  const tile = map.get(step.currentPosition) as Tile; // steps are guaranteed to lead to valid positions
  if(tile.hasBeenVisited(step.timesStraight, step.movementDirection)) { return []; }
  tile.visit(step.timesStraight, step.movementDirection);
  return makeNextValidSteps(map, step, makeValidMoves);
}

function findMinimumHeatLoss(map: Matrix<Tile>, makeValidMoves: (step: Step) => Vector2[]): number {
  const destination = map.getSize().subtract(new Vector2(1, 1));
  const stepComparator = (a: Step, b: Step) => a.compare(b);
  const stepsToCheck = new Heap(stepComparator);

  stepsToCheck.init([new Step(0, new Vector2(0, 0), 1, Vector2.Right()), new Step(0, new Vector2(0, 0), 1, Vector2.Down())]);

  while(!stepsToCheck.isEmpty()) {
    const step = stepsToCheck.pop() as Step;
    if(step.startPosition.equals(destination)) {
      return step.inputHeatLoss;
    }
    const newSteps = makeStep(map, step, makeValidMoves);
    stepsToCheck.push(...newSteps);
  }

  throw "Something went wrong and no path has been found";
}

function printSolution17Part1() {
  const map = parseInput();
  const minHeatLoss = findMinimumHeatLoss(map, makeValidMovesForStandardCrucible);
  console.log(minHeatLoss);
}

function printSolution17Part2() {
  const map = parseInput();
  const minHeatLoss = findMinimumHeatLoss(map, makeValidMovesForUltraCrucible);
  console.log(minHeatLoss);
}

export function printSolutions17() {
  printSolution17Part1();
  printSolution17Part2();
}