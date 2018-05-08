class Maze {
    constructor(cols, rows, cellSize) {
        this.cells = Maze.createMaze(cols, rows);
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
    }

    static createMaze(cols, rows) {

        // - Create 2D Array of Cells
        let tmpMaze = [];
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                tmpMaze.push(new Cell(x, y));
            }
        }

        //Generate the Maze

        let stack = [];
        let current = tmpMaze[0];
        current.available = false;
        do {
            let ne = Maze.getNeighbour(tmpMaze, current);
            if (ne) {
                current.removeWalls(ne);
                ne.available = false;
                stack.push(current);
                current = ne;
            }
            else if (stack.length > 0) {
                current = stack.pop();
            }
        } while (stack.length > 0);

        return tmpMaze;
    }

    static getNeighbour(maze, current) {
        let n = [];

        let t = maze[Maze.getIndex(maze, current.x, current.y - 1)];
        let b = maze[Maze.getIndex(maze, current.x, current.y + 1)];
        let l = maze[Maze.getIndex(maze, current.x - 1, current.y)];
        let r = maze[Maze.getIndex(maze, current.x + 1, current.y)];

        if (t && t.available == true) { n.push(t); }
        if (b && b.available == true) { n.push(b); }
        if (l && l.available == true) { n.push(l); }
        if (r && r.available == true) { n.push(r); }

        let rnd = floor(random(0, n.length));
        return n[rnd];
    }

    getNeighbour(current) {
        let n = [];

        let t = this.cells[this.getIndex(current.x, current.y - 1)];
        let b = this.cells[this.getIndex(current.x, current.y + 1)];
        let l = this.cells[this.getIndex(current.x - 1, current.y)];
        let r = this.cells[this.getIndex(current.x + 1, current.y)];

        if (t && !current.walls[0]) { n.push(t); }
        if (b && !current.walls[2]) { n.push(b); }
        if (l && !current.walls[3]) { n.push(l); }
        if (r && !current.walls[1]) { n.push(r); }

        return n[floor(random(0, n.length))];
    }

    getNeighbours(current) {
        let n = [];

        let t = this.cells[this.getIndex(current.x, current.y - 1)];
        let b = this.cells[this.getIndex(current.x, current.y + 1)];
        let l = this.cells[this.getIndex(current.x - 1, current.y)];
        let r = this.cells[this.getIndex(current.x + 1, current.y)];

        if (t && !current.walls[0]) { n.push(t); }
        if (b && !current.walls[2]) { n.push(b); }
        if (l && !current.walls[3]) { n.push(l); }
        if (r && !current.walls[1]) { n.push(r); }

        return n;
    }

    static getIndex(maze, x, y) {
        return maze.indexOf(maze.find(o => o.x == x && o.y == y));
    }

    getIndex(x, y) {
        return this.cells.indexOf(this.cells.find(o => o.x == x && o.y == y));
    }

    draw() {
        for (let c of this.cells) {
            c.draw(this.cellSize);
        }
    }
}

class Cell {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = [true, true, true, true];
        this.available = true;
    }

    removeWalls(target) {
        if (this.x - target.x == 1) {
            this.walls[3] = false;
            target.walls[1] = false;
        } else if (this.x - target.x == -1) {
            this.walls[1] = false;
            target.walls[3] = false;
        }

        if (this.y - target.y == 1) {
            this.walls[0] = false;
            target.walls[2] = false;
        } else if (this.y - target.y == -1) {
            this.walls[2] = false;
            target.walls[0] = false;
        }
    }

    draw(size) {

        push();
        noStroke();
        if (this.available) {
            fill(0, 255, 0, 100);
        } else {
            fill(150);
        }

        let drawX = this.x * size;
        let drawY = this.y * size;
        rect(drawX, drawY, size, size);
        pop();

        //Draw Lines

        //Top, Right, Bottom, Left
        if (this.walls[0]) {
            line(drawX, drawY, drawX + size, drawY);
        }
        if (this.walls[1]) {
            line(drawX + size, drawY, drawX + size, drawY + size);
        }
        if (this.walls[2]) {
            line(drawX, drawY + size, drawX + size, drawY + size);
        }
        if (this.walls[3]) {
            line(drawX, drawY, drawX, drawY + size);
        }
    }

    highlight(size) {

        noStroke();
        fill(255,0,0);

        let drawX = this.x * size;
        let drawY = this.y * size;
        rect(drawX, drawY, size, size);

        //Draw Lines
        stroke(0);

        //Top, Right, Bottom, Left
        if (this.walls[0]) {
            line(drawX, drawY, drawX + size, drawY);
        }
        if (this.walls[1]) {
            line(drawX + size, drawY, drawX + size, drawY + size);
        }
        if (this.walls[2]) {
            line(drawX, drawY + size, drawX + size, drawY + size);
        }
        if (this.walls[3]) {
            line(drawX, drawY, drawX, drawY + size);
        }
    }
}