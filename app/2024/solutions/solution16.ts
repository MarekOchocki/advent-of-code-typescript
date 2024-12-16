import * as fs from 'fs';
import { Matrix } from '../../utils/Matrix';
import { Rotation, Vector2 } from '../../utils/Vector2';

class MazeTile {
  private lowestUp = Number.MAX_SAFE_INTEGER;
  private lowestRight = Number.MAX_SAFE_INTEGER;
  private lowestDown = Number.MAX_SAFE_INTEGER;
  private lowestLeft = Number.MAX_SAFE_INTEGER;
  isPartOfBestPath = false;
  private hasBeenCheckForBestPathUp = false;
  private hasBeenCheckForBestPathRight = false;
  private hasBeenCheckForBestPathDown = false;
  private hasBeenCheckForBestPathLeft = false;
  constructor(public readonly type: string) {}

  hasBeenCheckForBestPathInDirection(direction: Vector2): boolean {
    if(direction.equals(Vector2.Up())) {
      return this.hasBeenCheckForBestPathUp;
    } else if (direction.equals(Vector2.Right())) {
      return this.hasBeenCheckForBestPathRight;
    } else if (direction.equals(Vector2.Down())) {
      return this.hasBeenCheckForBestPathDown;
    } else {
      return this.hasBeenCheckForBestPathLeft;
    }
  }
  
  markAsCheckedForBestPathInDirection(direction: Vector2): void {
    if(direction.equals(Vector2.Up())) {
      this.hasBeenCheckForBestPathUp = true;
    } else if (direction.equals(Vector2.Right())) {
      this.hasBeenCheckForBestPathRight = true;
    } else if (direction.equals(Vector2.Down())) {
      this.hasBeenCheckForBestPathDown = true;
    } else {
      this.hasBeenCheckForBestPathLeft = true;
    }
  }

  getLowestInDirection(direction: Vector2): number {
    if(direction.equals(Vector2.Up())) {
      return this.lowestUp;
    } else if (direction.equals(Vector2.Right())) {
      return this.lowestRight;
    } else if (direction.equals(Vector2.Down())) {
      return this.lowestDown;
    } else {
      return this.lowestLeft;
    }
  }

  setLowestInDirection(direction: Vector2, newLowest: number) {
    if(direction.equals(Vector2.Up())) {
      this.lowestUp = newLowest;
    } else if (direction.equals(Vector2.Right())) {
      this.lowestRight = newLowest;
    } else if (direction.equals(Vector2.Down())) {
      this.lowestDown = newLowest;
    } else {
      this.lowestLeft = newLowest;
    }
  }

  getLowestOverall(): number {
    return Math.min(
      this.lowestUp,
      this.lowestRight,
      this.lowestDown,
      this.lowestLeft
    );
  }
}

interface ReindeerMove {
  from: Vector2;
  direction: Vector2;
  scoreAfterMove: number;
}

class Maze {
  public mazeGrid: Matrix<MazeTile>;

  constructor(input: string) {
    this.mazeGrid = Matrix.fromString(input, c => new MazeTile(c));
    const startPosition = this.mazeGrid.findPosition(tile => tile.type === 'S');
    if(!startPosition) throw "Error: Can't find start position";
    this.traverseMaze(startPosition);
    this.markBestPathTiles();
  }

  getLowestScore(): number {
    const endTile = this.mazeGrid.find(tile => tile.type === 'E');
    if(!endTile) throw "Error: Can't find end position";
    return endTile.getLowestOverall();
  }

  getNumberOfTilesOnBestPaths(): number {
    return this.mazeGrid.reduce((acc, tile) => acc + (tile.isPartOfBestPath ? 1 : 0), 0);
  }

  private markBestPathTiles(): void {
    const endTilePosition = this.mazeGrid.findPosition(tile => tile.type === 'E');
    if(!endTilePosition) throw "Error: Can't find end position";
    const endTile = this.mazeGrid.get(endTilePosition);
    if(!endTile) throw "Error: Can't find end position";
    Vector2.forEachDirection(direction => this.markBestTilesAround(endTilePosition, direction));
  }

  private markBestTilesAround(position: Vector2, directionToBestPath: Vector2) {
    const tile = this.mazeGrid.get(position)!;
    if(tile.hasBeenCheckForBestPathInDirection(directionToBestPath)) {
      return;
    }
    tile.isPartOfBestPath = true;
    tile.markAsCheckedForBestPathInDirection(directionToBestPath);

    // straight
    {
      const nextTilePosition = position.add(directionToBestPath.reverse());
      const nextTile = this.mazeGrid.get(nextTilePosition)!;
      const nextTileScoreToBestPath = nextTile.getLowestInDirection(directionToBestPath) + 1;
      if(tile.getLowestInDirection(directionToBestPath) === nextTileScoreToBestPath) {
        this.markBestTilesAround(nextTilePosition, directionToBestPath);
      }
    }

    //bend 90 degrees
    {
      const nextTilePosition = position.add(directionToBestPath.rotate(Rotation.Clockwise));
      const nextTile = this.mazeGrid.get(nextTilePosition)!;
      const nextTileScoreToBestPath = nextTile.getLowestInDirection(directionToBestPath.rotate(Rotation.Counterclockwise)) + 1001;
      if(tile.getLowestInDirection(directionToBestPath) === nextTileScoreToBestPath) {
        this.markBestTilesAround(nextTilePosition, directionToBestPath.rotate(Rotation.Counterclockwise));
      }
    }

    //bend -90 degrees
    {
      const nextTilePosition = position.add(directionToBestPath.rotate(Rotation.Counterclockwise));
      const nextTile = this.mazeGrid.get(nextTilePosition)!;
      const nextTileScoreToBestPath = nextTile.getLowestInDirection(directionToBestPath.rotate(Rotation.Clockwise)) + 1001;
      if(tile.getLowestInDirection(directionToBestPath) === nextTileScoreToBestPath) {
        this.markBestTilesAround(nextTilePosition, directionToBestPath.rotate(Rotation.Clockwise));
      }
    }
  }

  private traverseMaze(startPosition: Vector2) {
    const startTile = this.mazeGrid.get(startPosition)!;
    startTile.setLowestInDirection(Vector2.Right(), 0);
    startTile.setLowestInDirection(Vector2.Up(), 1000);
    startTile.setLowestInDirection(Vector2.Down(), 1000);
    startTile.setLowestInDirection(Vector2.Left(), 2000);
    const startDirection = Vector2.Right();
    let movesToCheck: ReindeerMove[] = [
      {from: startPosition, direction: startDirection, scoreAfterMove: 1},
      {from: startPosition, direction: startDirection.rotate(Rotation.Clockwise), scoreAfterMove: 1001},
      {from: startPosition, direction: startDirection.rotate(Rotation.Counterclockwise), scoreAfterMove: 1001},
      {from: startPosition, direction: startDirection.reverse(), scoreAfterMove: 2001},
    ];

    let move = movesToCheck.pop();
    while(move !== undefined) {
      const newMoves = this.checkMove(move);
      movesToCheck.push(...newMoves);
      move = movesToCheck.pop();
    }
  }

  private checkMove(move: ReindeerMove): ReindeerMove[] {
    const destinationPosition = move.from.add(move.direction);
    const tile = this.mazeGrid.get(destinationPosition)!;
    if(tile.type === '#') return [];
    if(tile.type === 'E') {
      if(tile.getLowestOverall() < move.scoreAfterMove) return [];
      tile.setLowestInDirection(move.direction, move.scoreAfterMove);
      tile.setLowestInDirection(move.direction.rotate(Rotation.Clockwise), move.scoreAfterMove);
      tile.setLowestInDirection(move.direction.rotate(Rotation.Counterclockwise), move.scoreAfterMove);
      tile.setLowestInDirection(move.direction.reverse(), move.scoreAfterMove);
      return [];
    }

    const newMovesToCheck: ReindeerMove[] = [];

    if(tile.getLowestInDirection(move.direction) > move.scoreAfterMove) {
      tile.setLowestInDirection(move.direction, move.scoreAfterMove);
      newMovesToCheck.push({from: destinationPosition, direction: move.direction, scoreAfterMove: move.scoreAfterMove + 1});
    }
    let clockwiseDirection = move.direction.rotate(Rotation.Clockwise);
    if(tile.getLowestInDirection(clockwiseDirection) > move.scoreAfterMove + 1000) {
      tile.setLowestInDirection(clockwiseDirection, move.scoreAfterMove + 1000);
      newMovesToCheck.push({from: destinationPosition, direction: clockwiseDirection, scoreAfterMove: move.scoreAfterMove + 1001});
    }
    let counterclockwiseDirection = move.direction.rotate(Rotation.Counterclockwise);
    if(tile.getLowestInDirection(counterclockwiseDirection) > move.scoreAfterMove + 1000) {
      tile.setLowestInDirection(counterclockwiseDirection, move.scoreAfterMove + 1000);
      newMovesToCheck.push({from: destinationPosition, direction: counterclockwiseDirection, scoreAfterMove: move.scoreAfterMove + 1001});
    }
    let reversedDirection = move.direction.reverse();
    if(tile.getLowestInDirection(reversedDirection) > move.scoreAfterMove + 2000) {
      tile.setLowestInDirection(reversedDirection, move.scoreAfterMove + 2000);
    }
    return newMovesToCheck;
  }
}

export function printSolutions16(): void {
  const input = fs.readFileSync('./app/2024/res/input16.txt').toString();
  const maze = new Maze(input);
  console.log(maze.getLowestScore());
  console.log(maze.getNumberOfTilesOnBestPaths());
}