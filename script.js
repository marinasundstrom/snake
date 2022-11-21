let width = 10;
let depth = 10;
let tileSize = 32;

let snackCount = 0;

const snackCounter = document.getElementById("snackCounter");

const myCanvas = document.getElementById("myCanvas");

myCanvas.width = width * tileSize;
myCanvas.height = depth * tileSize;

let ctx = myCanvas.getContext("2d");

function drawGrid(width, depth) {
    for (let x1 = 0; x1 < width * tileSize; x1 += tileSize) {
        ctx.moveTo(x1, 0);
        ctx.lineTo(x1, myCanvas.height);
        ctx.stroke();
    }
    for (let y1 = 0; y1 < depth * tileSize; y1 += tileSize) {
        ctx.moveTo(0, y1);
        ctx.lineTo(myCanvas.width, y1);
        ctx.stroke();
    }
}

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
        snake.direction = 1;
    }
    else if (e.keyCode == '40') {
        // down arrow
        snake.direction = 2;
    }
    else if (e.keyCode == '37') {
        // left arrow
        snake.direction = 3;
    }
    else if (e.keyCode == '39') {
        // right arrow
        snake.direction = 4;
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

    forward() {
        this.appendSegmentFront();
        snake.segments.pop();
    }

    appendSegmentFront() {
        var topSegment = snake.getFrontSegment();
        let newCoord = 0;

        switch (snake.direction) {
            case north: // Up
                newCoord = topSegment.position.y - 1;
                if (newCoord < 0) {
                    newCoord = depth;
                }
                snake.segments.unshift(new Segment(new Coordinates(topSegment.position.x, newCoord)));
                break;

            case south: // Down
                newCoord = topSegment.position.y + 1;
                if (newCoord >= depth) {
                    newCoord = 0;
                }
                snake.segments.unshift(new Segment(new Coordinates(topSegment.position.x, newCoord)));
                break;

            case west: // Left
                newCoord = topSegment.position.x - 1;
                if (newCoord < 0) {
                    newCoord = width;
                }
                snake.segments.unshift(new Segment(new Coordinates(newCoord, topSegment.position.y)));
                break;

            case east: // Right
                newCoord = topSegment.position.x + 1;
                if (newCoord >= width) {
                    newCoord = 0;
                }
                snake.segments.unshift(new Segment(new Coordinates(newCoord, topSegment.position.y)));
                break;
        }
    }

    createRandomSegment() {
        const last = this.getLastSegment();

        const x = getRandomInt(0, width);
        const y = getRandomInt(0, depth);

        this.segments.push(new Segment(new Coordinates(x, y)));
    }

    appendSegmentBack() {
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

function createSnake() {
    const snake = new Snake();

    snake.direction = 1;
    
    snake.createRandomSegment();
    snake.appendSegmentBack();

    return snake;
}

let snake = createSnake();

const snacks = [];

function updateSnacks() {
    if (snacks.length == 0) {
        while (true) {
            const x = getRandomInt(0, width);
            const y = getRandomInt(0, depth);

            if (snake.segments.filter(c => c.position.x == x && c.position.y == y).length >= 1) {
                continue;
            }

            snacks.push(new Snack(new Coordinates(x, y)));
            break;
        }
    }
}

function updateSnake() {
    snake.forward();
    var topSegment = snake.getFrontSegment();
    //console.log(snake);

    const fsnacks = snacks.filter(c => c.position.equals(topSegment.position));
    
    if (fsnacks.length == 1) {
        const snack = fsnacks[0];
        console.log("Yummy!");
        const index = snacks.indexOf(snack)
        snacks.splice(index, 1);
        snake.appendSegmentFront();

        snackCount++;
        snackCounter.innerText = `${snackCount} snacks`;
    }
    const fsegs = snake.segments.filter(c => c != topSegment && c.position.equals(topSegment.position));
    if (fsegs.length == 1) {
        console.log("OOOUCH!");
        snake = createSnake();

        snackCount = 0;
        snackCounter.innerText = `${snackCount} snacks`;
    }
}

function drawSnacks() {
    for (const snack of snacks) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(snack.position.x * tileSize, snack.position.y * tileSize, tileSize, tileSize);
    }
}

function drawSnake() {
    const first = snake.getFrontSegment();

    for (const segment of snake.segments) {
        ctx.fillStyle = segment == first ? "#000000" : "#FF0000";
        ctx.fillRect(segment.position.x * tileSize, segment.position.y * tileSize, tileSize, tileSize);
    }
}

function draw() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

    drawSnacks();
    drawSnake();
    drawGrid(width, depth);
}

let speed = 500; // 2000

setInterval(() => {
    updateSnacks();
    updateSnake();
    draw();
}, speed);
