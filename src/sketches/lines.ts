import { globalMaze } from "..";
import { Maze } from "../maze";

const scale = 2;

/**
 * Draw some lines...
 */
export function linesSketch(sketch: any) {
  const maze = globalMaze();

  sketch.setup = function () {
    sketch.noLoop();
    sketch.createCanvas(
      maze.config.width + maze.config.border * scale,
      maze.config.height + maze.config.border * scale
    );
  };

  sketch.draw = function () {
    sketch.background("#fafafa");
    sketch.strokeWeight(4 * scale);
    sketch.stroke("orange");

    drawLines(sketch, maze);
  };
}

/**
 * Draw the maze as lines.
 *
 * @param sketch
 * @param maze
 */
function drawLines(sketch: p5, maze: Maze) {
  const { gap, border } = maze.config;
  const { width, height, numRows, numCols } = maze.config;

  // Calculate line lenghts.
  const lenx = width / numCols;
  const leny = height / numRows;

  // Draw rows of horizontal walls...
  maze.walls.h.forEach(function (rows, iX) {
    rows.forEach(function (wall, iY) {
      if (wall) {
        for (let j = 0; j < Math.floor(lenx / gap) + 1; j++) {
          sketch.point(border + lenx * iX + j * gap, border + leny * iY);
        }
      }
    });
  });

  // Draw columns of vertical walls...
  maze.walls.v.forEach(function (columns, iX) {
    columns.forEach(function (wall, iY) {
      if (wall) {
        for (let j = 0; j < Math.floor(leny / gap) + 1; j++) {
          sketch.point(border + lenx * iX, border + leny * iY + j * gap);
        }
      }
    });
  });
}
