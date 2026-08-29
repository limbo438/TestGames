const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");

const scoreText = document.getElementById("score");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

let playerX = 275;

let score = 0;
let gameRunning = false;

let obstacles = [];

let obstacleTimer;
let gameTimer;

let obstacleSpeed = 5;

const keys = {};

document.addEventListener("keydown", function (event) {
    keys[event.key] = true;
});

document.addEventListener("keyup", function (event) {
    keys[event.key] = false;
});

leftButton.addEventListener("pointerdown", function () {
    keys["touchLeft"] = true;
});

leftButton.addEventListener("pointerup", function () {
    keys["touchLeft"] = false;
});

leftButton.addEventListener("pointerleave", function () {
    keys["touchLeft"] = false;
});

rightButton.addEventListener("pointerdown", function () {
    keys["touchRight"] = true;
});

rightButton.addEventListener("pointerup", function () {
    keys["touchRight"] = false;
});

rightButton.addEventListener("pointerleave", function () {
    keys["touchRight"] = false;
});


function startGame() {
    score = 0;
    obstacleSpeed = 5;
    playerX = 275;

    player.style.left = playerX + "px";

    scoreText.textContent = "Score: 0";

    startScreen.style.display = "none";
    gameOverScreen.style.display = "none";

    clearObstacles();

    gameRunning = true;

    obstacleTimer = setInterval(createObstacle, 300);
    gameTimer = requestAnimationFrame(gameLoop);
}


function createObstacle() {
    if (!gameRunning)
        return;

    const obstacle = document.createElement("div");

    obstacle.classList.add("obstacle");

    const maxX = gameArea.clientWidth - 50;

    obstacle.x = Math.random() * maxX;
    obstacle.y = -50;

    obstacle.style.left = obstacle.x + "px";
    obstacle.style.top = obstacle.y + "px";

    gameArea.appendChild(obstacle);

    obstacles.push(obstacle);
}


function gameLoop() {
    if (!gameRunning)
        return;

    updatePlayer();
    updateObstacles();

    gameTimer = requestAnimationFrame(gameLoop);
}


function updatePlayer() {
    const moveSpeed = 7;

    if (keys["ArrowLeft"] || keys["a"] || keys["A"] || keys["touchLeft"])
        playerX -= moveSpeed;

    if (keys["ArrowRight"] || keys["d"] || keys["D"] || keys["touchRight"])
        playerX += moveSpeed;

    playerX = Math.max(0, Math.min(gameArea.clientWidth - 50, playerX));

    player.style.left = playerX + "px";
}


function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];

        obstacle.y += obstacleSpeed;

        obstacle.style.top = obstacle.y + "px";

        if (checkCollision(player, obstacle)) {
            endGame();
            return;
        }

        if (obstacle.y > gameArea.clientHeight) {
            obstacle.remove();
            obstacles.splice(i, 1);

            score++;
            scoreText.textContent = "Score: " + score;

            obstacleSpeed += 0.05;
        }
    }
}


function checkCollision(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    return (
        aRect.left < bRect.right &&
        aRect.right > bRect.left &&
        aRect.top < bRect.bottom &&
        aRect.bottom > bRect.top
    );
}


function endGame() {
    gameRunning = false;

    clearInterval(obstacleTimer);
    cancelAnimationFrame(gameTimer);

    finalScore.textContent = "Score: " + score;
    gameOverScreen.style.display = "flex";
}


function clearObstacles() {
    for (const obstacle of obstacles)
        obstacle.remove();

    obstacles = [];
}




startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", startGame);