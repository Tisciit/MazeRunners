class Runner {

    constructor(maze, x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.maxWallbreak = Runner.maxWallbreak;
        this.curWallbreak = Runner.maxWallbreak;
        this.color = color;
        this.controls = controls

        this.maze = maze;
        this.cell = maze.cells[maze.getIndex(x, y)];
        Runner.runners.push(this);
    }

    static setGlobals(maxWallbreak, interval) {
        Runner.maxWallbreak = maxWallbreak;
        Runner.interval = interval;
        Runner.runners = []
    }

    static intervalElapsed() {
        for (let runner of Runner.runners) {
            runner.curWallbreak = runner.curWallbreak < runner.maxWallbreak ? runner.curWallbreak + 1 : runner.curWallbreak;
        }
    }

    static moveAI() {
        for (let runner of Runner.runners) {
            if (!runner.controls) {
                let breaking = random();
                let info = runner.move(breaking > .9999999, Math.floor(random(1, 5)));

                stroke(runner.color);
                strokeWeight(5);
                info.oldCell.draw(maze.cellSize);
                info.newCell.draw(maze.cellSize);
                runner.draw();
            }
        }
    }

    static moveAIBetter() {
        for (let runner of Runner.runners) {
            if (!runner.controls) {
                let n = runner.maze.getNeighbours(runner.cell);
                let moveTo;

                do {
                    moveTo = n[floor(random(0, n.length))];
                } while (runner.origin == moveTo && n.length >= 2)

                let info;

                if (moveTo) {
                    if (runner.cell.x != moveTo.x) {
                        if (runner.cell.x < moveTo.x) {
                            runner.origin = runner.cell;
                            info = runner.move(false, 2);
                        }
                        else {
                            runner.origin = runner.cell;
                            info = runner.move(false, 4);
                        }
                    }
                    else {
                        if (runner.cell.y > moveTo.y) {
                            runner.origin = runner.cell;
                            info = runner.move(false, 1);
                        }
                        else {
                            runner.origin = runner.cell;
                            info = runner.move(false, 3);
                        }
                    }
                    stroke(runner.color);
                    strokeWeight(5);
                    info.oldCell.draw(maze.cellSize);
                    info.newCell.draw(maze.cellSize);
                    runner.draw();
                }

            }
        }
    }

    move(isBreakingWall, direction) {

        let target = undefined;
        let oldCell = this.cell;
        let canMove = false;
        let wallHasBeenBroken = false;

        switch (direction) {
            case 1: //Top
                target = this.maze.cells[this.maze.getIndex(this.x, this.y - 1)];
                break;
            case 2: //Right
                target = this.maze.cells[this.maze.getIndex(this.x + 1, this.y)];
                break;
            case 3: //Bottom
                target = this.maze.cells[this.maze.getIndex(this.x, this.y + 1)];
                break;
            case 4: //Left
                target = this.maze.cells[this.maze.getIndex(this.x - 1, this.y)];
                break;
            default:
                target = undefined;
                break;
        }

        canMove = !this.cell.walls[direction - 1]; //Check if Player could move without breaking a wall

        if (target && isBreakingWall && !canMove) {
            //Check if Player is actually removing a wall
            this.cell.removeWalls(target);
            this.curWallbreak -= 1;
            wallHasBeenBroken = true;
        }
        if (target && (canMove || isBreakingWall)) {
            //Move the player
            this.cell = target;
            this.x = target.x;
            this.y = target.y;
        }

        return new MoveInfo(oldCell, this.cell);
    }

    draw() {
        fill(this.color);
        stroke(0);
        let drawX = this.cell.x * this.maze.cellSize + this.maze.cellSize / 4;
        let drawY = this.y * this.maze.cellSize + this.maze.cellSize / 4;
        rect(drawX, drawY, this.maze.cellSize - (this.maze.cellSize / 2), this.maze.cellSize - (this.maze.cellSize / 2));
    }

    remove() {
        Runner.runners.splice(Runner.runners.indexOf(this), 1);
    }
}

class MoveInfo {
    constructor(oldCell, newCell) {
        this.oldCell = oldCell;
        this.newCell = newCell;
    }
}

class Controls {
    constructor(top, right, bottom, left, special) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
        this.special = special;
    }
}