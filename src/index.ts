import { Maze, MazeConfig } from "./maze";
import { linesSketch } from "./sketches/lines";
import { blocksSketch } from "./sketches/blocks";
import { borderlessBlocksSketch } from "./sketches/borderless-blocks";

const mazeConfig: MazeConfig = {
  width: 520,
  height: 100,

  numCols: 26,
  numRows: 5,

  directionWeights: [0.8, 0.8, 0.8, 1.0],
  gap: 3,
  border: 3
};

export function globalMaze() {
  // Setup maze...
  const maze: Maze = new Maze(mazeConfig);
  maze.findPath();

  return maze;
}

/**
 * Here we're using P5 in instance mode.
 *
 * @see https://github.com/processing/p5.js/wiki/Global-and-instance-mode
 */
new p5(linesSketch, document.getElementById("lines")!);
new p5(blocksSketch, document.getElementById("blocks")!);
new p5(borderlessBlocksSketch, document.getElementById("moreBlocks")!);
