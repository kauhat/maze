import { globalMaze } from "..";
import { Maze, Blocks, toBorderlessBlocks } from "../maze";

const scale = 2;

/**
 * Draw some more blocks...
 */
export function borderlessBlocksSketch(sketch: any) {
  const maze = globalMaze();
  const blocks = toBorderlessBlocks(maze);

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

    drawMoreBlocks(sketch, maze, blocks);
  };
}

/**
 * Draw the maze as some more grid blocks.
 *
 * @param sketch
 * @param maze
 * @param blocks
 */
function drawMoreBlocks(sketch: p5, maze: Maze, blocks: Blocks) {
  // Calculate size of blocks...
  const sqx = sketch.width / (maze.config.numCols * scale) - 0;
  const sqy = sketch.height / (maze.config.numRows * scale) + 0;

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
