import * as fs from 'fs';
import { ObjectSet } from '../../utils/ObjectSet';
import { Vector2 } from '../../utils/Vector2';
import { Matrix } from '../../utils/Matrix';

class TopographicMapElement {
  public readonly height: number;
  public reachablePeaks = new ObjectSet<Vector2>();
  public numberOfDistinctHikingTrails = 0;

  constructor(height: number) {
    this.height = height;
  }
}

function markPeaks(map: Matrix<TopographicMapElement>): void {
  map.forEach((t, position) => {
    if(t.height === 9) {
      t.reachablePeaks.add(position);
      t.numberOfDistinctHikingTrails = 1;
    }
  });
}

function traverseFromPeaks(map: Matrix<TopographicMapElement>): void {
  for(let i = 8; i >= 0; i--) {
    map.forEach((t, position) => {
      if(t.height !== i) { return; }
      Vector2.forEachDirection(direction => {
        const neighbor = map.get(position.add(direction));
        if(neighbor === undefined) { return; }
        if(neighbor.height === t.height + 1) {
          t.reachablePeaks.addFrom(neighbor.reachablePeaks);
          t.numberOfDistinctHikingTrails += neighbor.numberOfDistinctHikingTrails;
        }
      });
    });
  }
}

export function printSolutions10(): void {
  const input = fs.readFileSync('./app/2024/res/input10.txt').toString();
  const map = Matrix.fromString(input, c => new TopographicMapElement(+c));
  markPeaks(map);
  traverseFromPeaks(map);
  const sumOfScores = map.reduce((acc, el) => acc += el.height === 0 ? el.reachablePeaks.size() : 0, 0);
  const sumOfRatings = map.reduce((acc, el) => acc += el.height === 0 ? el.numberOfDistinctHikingTrails : 0, 0);
  console.log(sumOfScores);
  console.log(sumOfRatings);
}
