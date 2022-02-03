import p5 from "p5";
// import "p5/lib/addons/p5.dom";

import { Maze } from "./maze";

// p5.js sketches
import { linesSketch } from "./sketches/lines";
import { blocksSketch } from "./sketches/blocks";
import { borderlessBlocksSketch } from "./sketches/borderless-blocks";

/**
 * Set up a global maze instance so we can compare drawing methods.
 */
const defaultMaze = new Maze({
  width: 520,
  height: 100,

  numCols: 26,
  numRows: 5,

  directionWeights: [0.8, 0.8, 0.8, 1.0],
  gap: 3,
  border: 3
});

// Run path creation algorithm.
defaultMaze.findPath();

/**
 * Make a public function to get the instance from elsewhere.
 */
export function globalMaze() {
  return defaultMaze;
}

/**
 * Draw the sketches on page when loaded.
 *
 * Here we're using P5 in instance mode.
 *
 * @see https://github.com/processing/p5.js/wiki/Global-and-instance-mode
 */
export function setup() {
  console.log("Setting up p5 sketches...");
  new p5(linesSketch, document.getElementById("lines")!);
  new p5(blocksSketch, document.getElementById("blocks")!);
  new p5(borderlessBlocksSketch, document.getElementById("moreBlocks")!);
}

// Run setup on load.
// window.addEventListener("load", (event) => {
//   setup();
// });

// CodeSandbox doesn't like window load events.
setup();
