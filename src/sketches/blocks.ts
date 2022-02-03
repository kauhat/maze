import { globalMaze } from "..";
import { Maze, Blocks, toBlocks } from "../maze";

const scale = 2;

/**
 * Draw some blocks...
 */
export function blocksSketch(sketch: any) {
  const maze = globalMaze();
  const blocks = toBlocks(maze);

  sketch.setup = function () {
    sketch.noLoop();
    sketch.createCanvas(
      maze.config.width + maze.config.border * scale,
      maze.config.height + maze.config.border * scale
    );
  };

  sketch.draw = function () {
    sketch.background("#fafafa");
    sketch.strokeWeight(2);
    sketch.stroke("transparent");
    sketch.fill("#1c1c1c");

    drawBlocks(sketch, maze, blocks);
  };
}

/**
 * Draw the maze as grid blocks.
 *
 * @param sketch
 * @param maze
 * @param blocks
 */
function drawBlocks(sketch: p5, maze: Maze, blocks: Blocks) {
  // Calculate size of blocks...
  const sqx = maze.config.width / (maze.config.numCols * scale + 1);
  const sqy = maze.config.height / (maze.config.numRows * scale + 1);

  // Draw rows of grid blocks...
  blocks.forEach(function (rows, iX) {
    rows.forEach(function (block, iY) {
      if (block) {
        sketch.rect(
          maze.config.border + sqx * iX,
          maze.config.border + sqy * iY,
          sqx,
          sqy
        );
      }
    });
  });
}
