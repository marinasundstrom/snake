export class Game {
    width = 10;
    depth = 10;
    tileSize = 32;
    speed = 500; // 2000
    snackCount = 0;
    snackCounter = null;
    canvas = null;
    ctx = null;

    update() {
        this.updateSnacks();
        this.updateSnake();
    }

    draw() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.drawSnacks();
        this.drawSnake();
        this.drawGrid(this.width, this.depth);
    }

    start() {
        this.snackCounter = document.getElementById("snackCounter");
        this.canvas = document.getElementById("canvas");

        this.canvas.width = this.width * this.tileSize;
        this.canvas.height = this.depth * this.tileSize;

        this.ctx = canvas.getContext("2d");

        this.snake = this.createSnake();

        this.snacks = [];

        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, this.speed);
    }

    stop() {
        clearInterval(this.gameLoop);
    }

    createSnake() {
        const snake = new Snake();
    
        snake.direction = 1;
        
        snake.createRandomSegment(this.width, this.depth);
        snake.appendSegmentBack(this.width, this.depth);
    
        return snake;
    }

    updateSnacks() {
        if (this.snacks.length == 0) {
            while (true) {
                const x = getRandomInt(0, this.width);
                const y = getRandomInt(0, this.depth);
    
                if (this.snake.segments.filter(c => c.position.x == x && c.position.y == y).length >= 1) {
                    continue;
                }
    
                this.snacks.push(new Snack(new Coordinates(x, y)));
                break;
            }
        }
    }
    
    updateSnake() {
        this.snake.forward(this.width, this.depth);
        var topSegment = this.snake.getFrontSegment();
        //console.log(snake);
    
        const fsnacks = this.snacks.filter(c => c.position.equals(topSegment.position));
        
        if (fsnacks.length == 1) {
            const snack = fsnacks[0];
            console.log("Yummy!");
            const index = this.snacks.indexOf(snack)
            this.snacks.splice(index, 1);
            this.snake.appendSegmentFront(this.width, this.depth);
    
            this.snackCount++;
            this.updateSnackCounter();
        }
        const fsegs = this.snake.segments.filter(c => c != topSegment && c.position.equals(topSegment.position));
        if (fsegs.length == 1) {
            console.log("OOOUCH!");
            this.snake = this.createSnake();
    
            this.snackCount = 0;
            this.updateSnackCounter();
        }
    }

    updateSnackCounter() {
        this.snackCounter.innerText = `${this.snackCount} snacks`;
    }
    
    drawSnacks() {
        for (const snack of this.snacks) {
            this.ctx.fillStyle = "yellow";
            this.ctx.fillRect(snack.position.x * this.tileSize, snack.position.y * this.tileSize, this.tileSize, this.tileSize);
        }
    }
    
    drawSnake() {
        const first = this.snake.getFrontSegment();
    
        for (const segment of this.snake.segments) {
            this.ctx.fillStyle = segment == first ? "#000000" : "#FF0000";
            this.ctx.fillRect(segment.position.x * this.tileSize, segment.position.y * this.tileSize, this.tileSize, this.tileSize);
        }
    }

    drawGrid(width, depth) {
        for (let x1 = 0; x1 < this.width * this.tileSize; x1 += this.tileSize) {
            this.ctx.moveTo(x1, 0);
            this.ctx.lineTo(x1, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y1 = 0; y1 < this.depth * this.tileSize; y1 += this.tileSize) {
            this.ctx.moveTo(0, y1);
            this.ctx.lineTo(this.canvas.width, y1);
            this.ctx.stroke();
        }
    }
}

class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    equals(coordinates) {
        return this.x == coordinates.x && this.y == coordinates.y;
    }
}

class Snack {
    constructor(position) {
        this.position = position;
    }
}

const north = 1;
const south = 2;
const west = 3;
const east = 4;

class Snake {
    segments = []
    direction = 1;

    getFrontSegment() {
        return this.segments.at(0);
    }

    getLastSegment() {
        return this.segments.at(-1);
    }

    forward(width, depth) {
        this.appendSegmentFront(width, depth);
        this.segments.pop();
    }

    appendSegmentFront(width, depth) {
        var topSegment = this.getFrontSegment();
        let newCoord = 0;

        switch (this.direction) {
            case north: // Up
                newCoord = topSegment.position.y - 1;
                if (newCoord < 0) {
                    newCoord = depth;
                }
                this.segments.unshift(new Segment(new Coordinates(topSegment.position.x, newCoord)));
                break;

            case south: // Down
                newCoord = topSegment.position.y + 1;
                if (newCoord >= depth) {
                    newCoord = 0;
                }
                this.segments.unshift(new Segment(new Coordinates(topSegment.position.x, newCoord)));
                break;

            case west: // Left
                newCoord = topSegment.position.x - 1;
                if (newCoord < 0) {
                    newCoord = width;
                }
                this.segments.unshift(new Segment(new Coordinates(newCoord, topSegment.position.y)));
                break;

            case east: // Right
                newCoord = topSegment.position.x + 1;
                if (newCoord >= width) {
                    newCoord = 0;
                }
                this.segments.unshift(new Segment(new Coordinates(newCoord, topSegment.position.y)));
                break;
        }
    }

    createRandomSegment(width, depth) {
        const last = this.getLastSegment();

        const x = getRandomInt(1, width - 1);
        const y = getRandomInt(1, depth - 1);

        this.segments.push(new Segment(new Coordinates(x, y)));
    }

    appendSegmentBack(width, depth) {
        const last = this.getLastSegment();

        this.segments.push(new Segment(new Coordinates(last.position.x, last.position.y + 1)));
    }
}

class Segment {
    constructor(position) {
        this.position = position;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}