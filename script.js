import { Game } from "./game.js";

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
    game.start();
    
    document.onkeydown = checkKey;
    
    function checkKey(e) {
        e = e || window.event;
        if (e.keyCode == '38') {
            // up arrow
            game.snake.direction = 1;
        }
        else if (e.keyCode == '40') {
            // down arrow
            game.snake.direction = 2;
        }
        else if (e.keyCode == '37') {
            // left arrow
            game.snake.direction = 3;
        }
        else if (e.keyCode == '39') {
            // right arrow
            game.snake.direction = 4;
        }
    }
});