let ROWS = 100;
let COLS = 100;
let SIZE = 30;
let STEP = 1;

let intervals = 1;
let maze;
let r;
let spawnEm = true;

function setup() {

  createCanvas(SIZE * COLS, SIZE * ROWS)
  maze = new Maze(COLS, ROWS, SIZE);
  //maze.draw();

  Runner.setGlobals(5, 5000);

  //new Runner(0, 0, color(200, 200, 200), new Controls(87, 68, 83, 65, CONTROL));
  for (let i = 0; i < 70; i++) {
    new Runner(maze, Math.floor(random(0, COLS - 2)), Math.floor(random(0, ROWS - 2)), color(random(255), random(255), random(255), 200));
  }

  //r = new Runner(maze, 0, ROWS - 1, color(0, 255, 200), new Controls(UP_ARROW, RIGHT_ARROW, DOWN_ARROW, LEFT_ARROW, 32));

  frameRate(60);
}



function draw() {
  if (Runner.interval * intervals < millis()) {
    Runner.intervalElapsed();
    intervals++;
    
    if(Runner.runners.length < 1000 && spawnEm){
      for(let i = 0; i < 0; i++){
        new Runner(maze, Math.floor(random(0, COLS - 2)), Math.floor(random(0, ROWS - 2)), color(random(255), random(255), random(255)));
      }
    }
  }
  Runner.moveAIBetter();
  //checkCollision();
}

function keyPressed() {

  for (let runner of Runner.runners) {

    if (!runner.controls) {
      continue;
    }

    let info; //Info returned from runner.move for drawing the cells of the maze

    //Check if Player is trying to remove the wall
    let removeWall = keyIsDown(runner.controls.special);
    if (removeWall) {
      //Set removeWall to Runners possibility to remove a wall
      removeWall = runner.curWallbreak > 0;
    }

    //Determine, which direction the player wants to go and move him.
    if (keyCode == runner.controls.top) {
      info = runner.move(removeWall, 1);
    }
    if (keyCode == runner.controls.right) {
      info = runner.move(removeWall, 2);
    }
    if (keyCode == runner.controls.bottom) {
      info = runner.move(removeWall, 3);
    }
    if (keyCode == runner.controls.left) {
      info = runner.move(removeWall, 4);
    }

    if (info) {
      info.oldCell.draw(maze.cellSize);
      info.newCell.draw(maze.cellSize);
      runner.draw();
    }
  }

  return false;
}

function checkCollision() {
  for (let runner of Runner.runners) {
    if (r.cell.x == runner.cell.x && r.cell.y == runner.cell.y && !runner.controls) {
      runner.remove();
      r.maxWallbreak++;
      r.curWallbreak = r.maxWallbreak;
    }
  }
}


