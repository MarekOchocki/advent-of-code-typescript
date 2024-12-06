import * as fs from 'fs';
import { Matrix } from '../../utils/Matrix';
import { assertDefined } from '../../utils/assert-guards';
import { Rotation, Vector2 } from '../../utils/Vector2';


class Guard {
  constructor(public position: Vector2, public direction: Vector2) {}

  takeOneStep(map: Matrix<string>) {
    this.rotateUntilClearPathInFront(map);
    this.position = this.position.add(this.direction);
  }

  rotateUntilClearPathInFront(map: Matrix<string>) {
    while(true) {
      const positionInFront = this.position.add(this.direction);
      if(map.get(positionInFront) === '#') {
        this.direction = this.direction.rotate(Rotation.Clockwise);
        continue;
      }
      break;
    }
  }
}

function doesLoop(map: Matrix<string>, startPosition: Vector2, startDirection: Vector2): boolean {
  const hareGuard = new Guard(startPosition, startDirection);
  const tortoiseGuard = new Guard(startPosition, startDirection);
  while(map.get(hareGuard.position) !== undefined) {
    hareGuard.takeOneStep(map);
    hareGuard.takeOneStep(map);
    tortoiseGuard.takeOneStep(map);
    if(hareGuard.position.equals(tortoiseGuard.position) && hareGuard.direction.equals(tortoiseGuard.direction)) {
      return true;
    }
  }
  return false;
}

function getNumberOfValidObstructionsAndMarkPath(map: Matrix<string>, startPosition: Vector2): number {
  let numberOfValidObstructions = 0;
  const guard = new Guard(startPosition, Vector2.Up());
  while(map.get(guard.position) !== undefined) {
    const positionInFront = guard.position.add(guard.direction);
    if(map.get(positionInFront) !== 'X') {
      map.set(positionInFront, '#');
      if(doesLoop(map, guard.position, guard.direction)) {
        numberOfValidObstructions++;
      }
      map.set(positionInFront, '.');
    }
    map.set(guard.position, 'X');
    guard.takeOneStep(map);
    guard.rotateUntilClearPathInFront(map);
  }
  return numberOfValidObstructions;
}

export function printSolutions6(): void {
  const input = fs.readFileSync('./app/2024/res/input6.txt').toString();
  const map = Matrix.fromString(input, (c) => c);
  const startPosition = map.findPosition(v => v === '^');
  assertDefined(startPosition);
  const numberOfValidObstructions = getNumberOfValidObstructionsAndMarkPath(map, startPosition);
  const pathLength = map.reduce((acc, element) => acc += element === 'X' ? 1 : 0, 0);
  console.log(pathLength);
  console.log(numberOfValidObstructions);
}
