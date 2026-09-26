const can = document.getElementById("canvas");
const ctx = can.getContext('2d');
const radius = 30;
const rectw = 30;
const recth = 200;
let bat1UpKeyPressed = false;
let bat1DownKeyPressed = false;
let bat2UpKeyPressed = false;
let bat2DownKeyPressed = false;

can.width = window.innerWidth;
can.height = window.innerHeight;

const xPosBat1 = 0;
let yPosBat1 = can.height / 2 - recth / 2;
const xPosBat2 = can.width - rectw;
let yPosBat2 = can.height / 2 - recth / 2;

let x = can.width / 2;
let y = can.height - 30;
let dx = 2;
let dy = -2;

let p1Score = 0;
let p2Score = 0;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
}

function drawRectangle(rx, ry) {
    ctx.beginPath();
    ctx.rect(rx, ry, rectw, recth);
    ctx.fillStyle = "white";
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, can.width, can.height);
    drawBall();
    drawRectangle(xPosBat1, yPosBat1);
    drawRectangle(xPosBat2, yPosBat2);
    updateBall();
    moveBat1();
    moveBat2();
}

function updateBall() {
    if (y + dy > can.height - radius || y + dy < radius) {
        dy = -dy;
    }

    if (x + dx - radius <= xPosBat1 + rectw && x >= xPosBat1) {
        if (y >= yPosBat1 && y <= yPosBat1 + recth) {
            dx = -dx;
            x = xPosBat1 + rectw + radius; 
        }
    }

    if (x + dx + radius >= xPosBat2 && x <= xPosBat2 + rectw) {
        if (y >= yPosBat2 && y <= yPosBat2 + recth) {
            dx = -dx;
            x = xPosBat2 - radius;
        }
    }

    if (x < 0) {
        p2Score++;
        document.getElementById("player2").innerText = p2Score;
        x = can.width / 2;
        y = can.height / 2;
        dx = -dx;
    } else if (x > can.width) {
        p1Score++;
        document.getElementById("player1").innerText = p1Score;
        x = can.width / 2;
        y = can.height / 2;
        dx = -dx;
    }

    x += dx;
    y += dy;
}

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

document.addEventListener("keydown", (e) => {
    Bat1keyDownhandler(e);
    Bat2keyDownhandler(e);
});

document.addEventListener("keyup", (e) => {
    Bat1keyUphandler(e);
    Bat2keyUphandler(e);
});

function startGame() {
    setInterval(draw, 10);
}

startGame();