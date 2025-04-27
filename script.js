let isPaused = false;
let intervalId;
var brickImage = new Image();
brickImage.src = 'img/invader.png';
let wobbleTimer = 0;
let wobbleDirection = 1;
let wobbleInterval = 500;
var brickImage1 = new Image();
brickImage1.src = 'img/invader.png';
var brickImage2 = new Image();
brickImage2.src = 'img/invader2.png';
var brickImage = brickImage1;
let selectedDifficulty = "normal";
let speedMultiplier = 1;
let x = 308;
let y = 400;
let dx = 1;
let dy = 1;
let WIDTH;
let HEIGHT;
let r = 6;
let tocke = 0;
let rowcolors = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"];
let paddlecolor = "#FFFFFF";
let ballcolor = "#FFFFFF";
let bricks = [];
let brickRowCount = 3;
let brickColumnCount = 10;
let brickWidth = 50;
let brickHeight = 50;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 50;
let ctx;
let rightDown = false;
let leftDown = false;
let paddlex;
let paddleh;
let paddlew;

function setupGame() {
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    init_paddle();
    initBricks();
    clear();
}

setupGame();

$("#startBtn").click(function () {
    selectedDifficulty = $("#difficultySelect").val();

    if (selectedDifficulty === "easy") {
        speedMultiplier = 1.5;
    } else if (selectedDifficulty === "normal") {
        speedMultiplier = 2;
    } else if (selectedDifficulty === "hard") {
        speedMultiplier = 2.75;
    }

    if (!intervalId) {
        intervalId = setInterval(draw, 10);
    }
});

function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function init_paddle() {
    paddlex = WIDTH / 2 - 50;
    paddleh = 10;
    paddlew = 100;
}

function onKeyDown(evt) {
    if (evt.keyCode == 39 || evt.keyCode == 68) rightDown = true;
    else if (evt.keyCode == 37 || evt.keyCode == 65) leftDown = true;
}

function onKeyUp(evt) {
    if (evt.keyCode == 39 || evt.keyCode == 68) rightDown = false;
    else if (evt.keyCode == 37 || evt.keyCode == 65) leftDown = false;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft + (wobbleDirection * 2);
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.drawImage(brickImage, brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

function collisionDetection() {
    let allBricksCleared = true;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                allBricksCleared = false;
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    tocke += 1;
                    $("#tocke").html(tocke);
                }
            }
        }
    }

    if (allBricksCleared) {
        clearInterval(intervalId);
        Swal.fire({
            title: 'Bravo!',
            text: 'Uničil si vse "invaderje" in dobil: ' + tocke + ' točk.',
            icon: 'success',
            confirmButtonText: 'Igraj znova?',
            customClass: {
                confirmButton: 'ButtonJs'
            },
            willClose: () => {
                location.reload();
            }
        });
    }
}

function draw() {
    if (isPaused) return;

    clear();
    ctx.fillStyle = ballcolor;
    circle(x, y, r);

    if (rightDown && paddlex + paddlew < WIDTH) paddlex += 5;
    if (leftDown && paddlex > 0) paddlex -= 5;

    ctx.fillStyle = paddlecolor;
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
    wobbleTimer += 10;
    if (wobbleTimer >= wobbleInterval) {
        wobbleDirection *= -1;
        wobbleTimer = 0;
        
        if (brickImage === brickImage1) {
            brickImage = brickImage2;
        } else {
            brickImage = brickImage1;
        }
    }

    drawBricks();
    collisionDetection();

    x += dx * speedMultiplier;
    y += dy * speedMultiplier;

    if (x + dx > WIDTH - r || x + dx < r) dx = -dx;
    if (y + dy < r) {
        dy = -dy;
    } else if (y + r >= HEIGHT - paddleh && x > paddlex && x < paddlex + paddlew) {
        dy = -dy;
        let hitPos = (x - (paddlex + paddlew / 2)) / (paddlew / 2);
        dx = hitPos * 1.5;
    } else if (y + r > HEIGHT) {
        clearInterval(intervalId);
        Swal.fire({
            title: 'Konec igre!',
            text: 'Točke: ' + tocke,
            icon: 'error',
            confirmButtonText: 'Poskusi znova',
            customClass: {
                confirmButton: 'ButtonJs'
            },
            willClose: () => {
                location.reload();
            }
        });
    }
}


function initBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

$("#pauseResumeBtn").click(function () {
    if (intervalId) {
        if (isPaused) {
            isPaused = false;
            $(this).text("Pause");
        } else {
            isPaused = true;
            $(this).text("Resume");
        }
    }
});

$("#vizitkaBtn").click(function () {
    Swal.fire({
        title: 'Vizitka',
        html: `
            <br>
            <p>Maj Klinc</p>
            <br>
            <p>4. Rb</p>
        `,
        icon: 'info',
        confirmButtonText: 'Zapri',
        customClass: {
            confirmButton: 'ButtonJs'
        }
    });
});
