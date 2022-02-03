export type Coords = {
  x: number;
  y: number;
};

type Cell = boolean;
type Wall = boolean;
type Direction = number;

type AdjacentCell = {
  coords: Coords;
  direction: Direction;
};

export type MazeConfig = {
  width: number;
  height: number;

  numCols: number;
  numRows: number;

  directionWeights: number[];
  gap: number;
  border: number;
};

export class Maze {
  config: MazeConfig;

  // The cells that have been visited.
  cells: Cell[][];

  // Walls...
  walls: {
    h: Wall[][];
    v: Wall[][];
  };

  constructor(config: MazeConfig) {
    this.config = config;

    //
    this.walls = { h: [], v: [] };
    this.cells = [];

    // Horizontal walls...
    for (let i = 0; i < config.numCols; i++) {
      this.walls.h[i] = [];
      for (let j = 0; j < config.numRows + 1; j++) {
        this.walls.h[i][j] = true;
      }
    }

    // Vertical walls...
    for (let i = 0; i < config.numCols + 1; i++) {
      this.walls.v[i] = [];
      for (let j = 0; j < config.numRows; j++) {
        this.walls.v[i][j] = true;
      }
    }

    // Cells...
    for (let i = 0; i < config.numCols; i++) {
      this.cells[i] = [];
      for (let j = 0; j < config.numRows; j++) {
        this.cells[i][j] = true;
      }
    }
  }

  findPath() {
    // Calculate the max amount of iterations allowed.
    const { numCols, numRows } = this.config;
    const maxIterations = numCols * numRows;

    console.log(`Max iterations: ${maxIterations}`);

    // Setup a stack.
    const stack: Coords[] = [];

    // Push the starting cell onto the stack.
    const initial: Coords = { x: 0, y: 0 };
    stack.push(initial);

    //
    let i = 0;
    while (stack.length && i++ < 1000) {
      this.evalCell(stack);
    }
  }

  evalCell(stack: Coords[]) {
    // Get the top item of the stack.
    const coords = stack.slice(-1)[0];

    //
    let { x, y } = coords;

    // Mark the cell as visited.
    this.cells[x][y] = false;

    // Get the next adjacent cell.
    const next = this.getNext(coords);

    if (next == null) {
      stack.pop();
      return;
    }

    switch (next.direction) {
      case -1:
        stack.pop();
        break;

      case 0:
        this.walls.h[x][y] = false; // T
        stack.push(next.coords);
        break;

      case 1:
        this.walls.h[x][y + 1] = false; // B
        stack.push(next.coords);
        break;

      case 2:
        this.walls.v[x][y] = false; // L
        stack.push(next.coords);
        break;

      case 3:
        this.walls.v[x + 1][y] = false; // R
        stack.push(next.coords);
        break;
    }
  }

  getNeighbors(coords: Coords): AdjacentCell[] {
    const { x, y } = coords;
    const { numRows, numCols } = this.config;

    let potentialNeighbors: AdjacentCell[] = [];

    // Top...
    if (y - 1 >= 0) {
      potentialNeighbors.push({
        coords: { x: x, y: y - 1 },
        direction: 0
      });
    }

    // Bottom...
    if (y + 1 < numRows) {
      potentialNeighbors.push({
        coords: { x: x, y: y + 1 },
        direction: 1
      });
    }

    // Left..
    if (x - 1 >= 0) {
      potentialNeighbors.push({
        coords: { x: x - 1, y: y },
        direction: 2
      });
    }

    // Right...
    if (x + 1 < numCols) {
      potentialNeighbors.push({
        coords: { x: x + 1, y: y },
        direction: 3
      });
    }

    //
    // const potentialNeighbors: AdjacentCell[] = [top, bottom, left, right];

    // console.log("potential", potentialNeighbors);

    // const that = this;

    return potentialNeighbors.filter((neighbor): boolean => {
      const { coords } = neighbor;

      // Check if cell has already been visited.
      if (this.cells[coords.x][coords.y] === false) {
        return false;
      }

      return true;
    });
  }

  getNext(coords: Coords): AdjacentCell | null {
    const neighbors = this.getNeighbors(coords);

    // console.log(neighbors);

    const weighted = neighbors.map(
      (neighbor: AdjacentCell) =>
        Math.random() * this.config.directionWeights[neighbor.direction]
    );

    // console.log(weighted);

    const top = Math.max(...weighted);
    const nextIndex = weighted.indexOf(top);

    let pass = 0;
    for (let j = 0; j < 4; j++) {
      if (weighted[j] > 0) {
        pass = 1;
      }
    }

    if (pass) {
      return {
        coords: neighbors[nextIndex].coords,
        direction: neighbors[nextIndex].direction
      };
    }

    return null;
  }
}

/*
 *
 */
export type Blocks = number[][];

/*
 *
 */
export function toBlocks(maze: Maze): Blocks {
  const { numCols, numRows } = maze.config;

  // initialise empty [][] array
  const out: Blocks = [];

  const setBlock = function (coords: Coords) {
    out[coords.x][coords.y] = 1;
  };

  for (let i = 0; i < 2 * numCols + 1; i++) {
    out[i] = [];
    for (let j = 0; j < 2 * numRows + 1; j++) {
      out[i][j] = 0;
    }
  }

  //
  maze.walls.h.forEach(function (arr, iX) {
    arr.forEach(function (exists, iY) {
      if (exists) {
        setBlock({ x: 2 * iX, y: 2 * iY });
        setBlock({ x: 2 * iX + 1, y: 2 * iY });
      }
    });
  });

  maze.walls.v.forEach(function (arr, iX) {
    arr.forEach(function (exists, iY) {
      if (exists) {
        setBlock({ x: 2 * iX, y: 2 * iY });
        setBlock({ x: 2 * iX, y: 2 * iY + 1 });
      }
    });
  });

  // Add wall to end corner.
  setBlock({ x: 2 * numCols, y: 2 * numRows });

  return out;
}

/*
 *
 */
export function toBorderlessBlocks(maze: Maze): Blocks {
  const { numCols, numRows } = maze.config;

  // initialise empty [][] array
  const out: Blocks = [];

  const setBlock = function (coords: Coords, cellValue = 1) {
    try {
      out[coords.x][coords.y] = cellValue;
    } catch (e) {
      console.log(`Could not set block: ${JSON.stringify(coords)}`);
    }
  };

  setBlock({ x: 100, y: 0 });

  for (let i = 0; i < 2 * numCols; i++) {
    out[i] = [];
    for (let j = 0; j < 2 * numRows - 1; j++) {
      out[i][j] = 0;
    }
  }

  //

  maze.walls.h.slice(0, numCols).forEach(function (arr, iX) {
    arr.slice(0, numRows).forEach(function (exists, iY) {
      if (exists) {
        setBlock({ x: 2 * iX, y: 2 * iY });
        setBlock({ x: 2 * iX + 1, y: 2 * iY });
      }
    });
  });

  maze.walls.v.slice(0, numCols).forEach(function (arr, iX) {
    arr.slice(0, numRows).forEach(function (exists, iY) {
      if (exists) {
        setBlock({
          x: 2 * iX,
          y: 2 * iY
        });
        setBlock({ x: 2 * iX, y: 2 * iY + 1 });
      }
    });
  });

  // Add wall to end corner.
  // setBlock({ x: 2 * maze.config.numCols - 1, y: 2 * maze.config.numRows - 1 });

  const exitHoleY = Math.floor(Math.random() * (numRows + 1));
  setBlock({ x: 2 * numCols - 2, y: 2 * exitHoleY }, 0);

  // console.log(JSON.stringify(out));

  return out;
}
