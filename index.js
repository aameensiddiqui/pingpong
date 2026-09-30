const can = document.getElementById("canvas");
const ctx = can.getContext('2d');
const rectw = 30;
const recth = 200;
let bat1UpKeyPressed = false;
let bat1DownKeyPressed = false;
let bat2UpKeyPressed = false;
let bat2DownKeyPressed = false;

let radius = 30;
const minRadius = 10;
const maxRadius = 100;
const radiusStep = 5;

can.width = window.innerWidth;
can.height = window.innerHeight;

const xPosBat1 = 0;
let yPosBat1 = can.height / 2 - recth / 2;
const xPosBat2 = can.width - rectw;
let yPosBat2 = can.height / 2 - recth / 2;

// speed
// let dx = 2;
// let dy = -2;
let speed = 2;
const minSpeed = 1;
const maxSpeed = 10;
const speedStep = 1;

let x = can.width / 2;
let y = can.height - 30;
let dx = speed;
let dy = -speed;

let p1Score = 0;
let p2Score = 0;

const winningScore = 5;
let gameOver = false;

const hitSound = new Audio("/audio/insulted_me.mp3");
hitSound.volume = 1.0;
const scoreSound = new Audio("/audio/gareeb.mp3");
scoreSound.volume = 0.6;

function playHitSound() {
    const s = hitSound.cloneNode();
    s.volume = hitSound.volume;
    s.play().catch(() => {});
}

function playScoreSound() {
    const s2 = scoreSound.cloneNode();
    s2.volume = scoreSound.volume;
    s2.play().catch(() => {});
}

const ballImg = new Image();
ballImg.src = "image/mahesh.png";

// function drawBall() {
//     ctx.beginPath();
//     ctx.arc(x, y, radius, 0, Math.PI * 2);
//     ctx.fillStyle = "yellow";
//     ctx.fill();
// }

function drawBall() {
    // yellow
    if (!ballImg.complete || ballImg.naturalWidth === 0) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();
        return;
    }
    // image
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(ballImg, x - radius, y - radius, radius * 2, radius * 2);
    ctx.restore();
}

function drawRectangle(rx, ry, topLabel, bottomLabel) {
    ctx.beginPath();
    ctx.rect(rx, ry, rectw, recth);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.fillStyle = "#181818";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(topLabel, rx + rectw / 2, ry + 25);
    ctx.fillText(bottomLabel, rx + rectw / 2, ry + recth - 25);
}

// main fun. for rendering 1 ball and 2 bats
function draw() {
    ctx.clearRect(0, 0, can.width, can.height);
    drawBall();
    drawRectangle(xPosBat1, yPosBat1, "W", "S");
    drawRectangle(xPosBat2, yPosBat2, "▲", "▼");

    if (gameOver) return;

    updateBall();
    moveBat1();
    moveBat2();
}

// movements of ball
function updateBall() {
    if (y + dy > can.height - radius || y + dy < radius) {
        dy = -dy;
    }

    if (x + dx - radius <= xPosBat1 + rectw && x >= xPosBat1) {
        if (y >= yPosBat1 && y <= yPosBat1 + recth) {
            dx = -dx;
            x = xPosBat1 + rectw + radius;
            playHitSound();
        }
    }

    if (x + dx + radius >= xPosBat2 && x <= xPosBat2 + rectw) {
        if (y >= yPosBat2 && y <= yPosBat2 + recth) {
            dx = -dx;
            x = xPosBat2 - radius;
            playHitSound();
        }
    }

    if (x < 0) {
        p2Score++;
        playScoreSound();
        document.getElementById("player2").innerText = p2Score;
        x = can.width / 2;
        y = can.height / 2;
        dx = -dx;
    } else if (x > can.width) {
        p1Score++;
        playScoreSound();
        document.getElementById("player1").innerText = p1Score;
        x = can.width / 2;
        y = can.height / 2;
        dx = -dx;
    }

    checkWinner();

    x += dx;
    y += dy;
}

// bat 1 (left)
function Bat1keyDownhandler(e) {
    if (e.key == "w" || e.key == "W") bat1UpKeyPressed = true;
    else if (e.key == "s" || e.key == "S") bat1DownKeyPressed = true;
}

function Bat1keyUphandler(e) {
    if (e.key == "w" || e.key == "W") bat1UpKeyPressed = false;
    else if (e.key == "s" || e.key == "S") bat1DownKeyPressed = false;
}

function moveBat1() {
    if (bat1UpKeyPressed && yPosBat1 > 0) {
        yPosBat1 -= 4;
    } else if (bat1DownKeyPressed && yPosBat1 < can.height - recth) {
        yPosBat1 += 4;
    }
}

// bat 2 (right)
function Bat2keyDownhandler(e) {
    if (e.key == "ArrowUp") bat2UpKeyPressed = true;
    else if (e.key == "ArrowDown") bat2DownKeyPressed = true;
}

function Bat2keyUphandler(e) {
    if (e.key == "ArrowUp") bat2UpKeyPressed = false;
    else if (e.key == "ArrowDown") bat2DownKeyPressed = false;
}

function moveBat2() {
    if (bat2UpKeyPressed && yPosBat2 > 0) {
        yPosBat2 -= 4;
    } else if (bat2DownKeyPressed && yPosBat2 < can.height - recth) {
        yPosBat2 += 4;
    }
}

// keypress
document.addEventListener("keydown", (e) => {
    Bat1keyDownhandler(e);
    Bat2keyDownhandler(e);
});

document.addEventListener("keyup", (e) => {
    Bat1keyUphandler(e);
    Bat2keyUphandler(e);
});


// ball radius
function changeRadius(amount) {
    radius = Math.min(maxRadius, Math.max(minRadius, radius + amount));
    y = Math.min(can.height - radius, Math.max(radius, y));
}

document.getElementById("increaseBall").addEventListener("click", (e) => {
    changeRadius(radiusStep);
    e.target.blur();
});

document.getElementById("decreaseBall").addEventListener("click", (e) => {
    changeRadius(-radiusStep);
    e.target.blur();
});

// ball speed
function changeSpeed(amount) {
    speed = Math.min(maxSpeed, Math.max(minSpeed, speed + amount));
    dx = Math.sign(dx) * speed;
    dy = Math.sign(dy) * speed;
}

document.getElementById("increaseSpeed").addEventListener("click", (e) => {
    changeSpeed(speedStep);
    e.target.blur();
});

document.getElementById("decreaseSpeed").addEventListener("click", (e) => {
    changeSpeed(-speedStep);
    e.target.blur();
});

// main game fun : start
function startGame() {
    setInterval(draw, 10);
}

// for checking winner
function checkWinner() {
    // debugger;
    if (p1Score >= winningScore) endGame("Player 1");
    else if (p2Score >= winningScore) endGame("Player 2");
}

function endGame(winner) {
    gameOver = true;

    bat1UpKeyPressed = bat1DownKeyPressed = false;
    bat2UpKeyPressed = bat2DownKeyPressed = false;

    document.getElementById("winnerText").innerText = winner + " wins!";
    document.getElementById("gameOver").classList.remove("hidden");
}

function restartGame() {
    p1Score = 0;
    p2Score = 0;
    document.getElementById("player1").innerText = 0;
    document.getElementById("player2").innerText = 0;

    x = can.width / 2;
    y = can.height / 2;
    dx = speed * (Math.random() < 0.5 ? -1 : 1);
    dy = speed * (Math.random() < 0.5 ? -1 : 1);

    yPosBat1 = can.height / 2 - recth / 2;
    yPosBat2 = can.height / 2 - recth / 2;

    gameOver = false;
    document.getElementById("gameOver").classList.add("hidden");
}

document.getElementById("restartBtn").addEventListener("click", (e) => {
    restartGame();
    e.target.blur();
});

// start
startGame();
