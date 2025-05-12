$(document).ready(function () {
    Swal.fire({
        title: 'Vesoljski vsiljivci!',
        text: 'Uniči vesoljce - plošček ( A , D ali <- , -> ) in odbijaj metek v njih, srečno!',
        icon: 'info',
        confirmButtonText: 'Začni',
        customClass: {
            confirmButton: 'ButtonJs'
        }
    });
});


let isPaused = false;
let intervalId;

let brickImage1_easy = new Image();
brickImage1_easy.src = 'img/invader1.png';
let brickImage2_easy = new Image();
brickImage2_easy.src = 'img/invader2.png';
let brickImage1_normal = new Image();
brickImage1_normal.src = 'img/invader3.png';
let brickImage2_normal = new Image();
brickImage2_normal.src = 'img/invader4.png';
let brickImage1_hard = new Image();
brickImage1_hard.src = 'img/invader5.png';
let brickImage2_hard = new Image();
brickImage2_hard.src = 'img/invader6.png';

let wobbleTimer = 0;
let wobbleDirection = 1;
let wobbleInterval = 500;
let selectedDifficulty = "normal";
let speedMultiplier = 1;
let x = 304;
let y = 400;
let dx = 0.7; //hitrost zoge x
let dy = 0.7; //hitrost zoge y
let WIDTH;
let HEIGHT;
let r = 6;
let tocke = 0;
let paddlecolor = "#FFFFFF";
let ballcolor = "#FFFFFF";
let bricks = []; //tabela
let brickRowCount = 3;
let brickColumnCount = 10;
let brickWidth = 50;
let brickHeight = 40;
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

$("#startBtn").click(function (event) {
    event.preventDefault(); // ne pusti poslat

    selectedDifficulty = $("#difficultySelect").val();

    if (selectedDifficulty === "easy") {
        speedMultiplier = 4;
        currentBrickFrame1 = brickImage1_easy;
        currentBrickFrame2 = brickImage2_easy;
    } else if (selectedDifficulty === "normal") {
        speedMultiplier = 6;
        currentBrickFrame1 = brickImage1_normal;
        currentBrickFrame2 = brickImage2_normal;
    } else if (selectedDifficulty === "hard") {
        speedMultiplier = 8;
        currentBrickFrame1 = brickImage1_hard;
        currentBrickFrame2 = brickImage2_hard;
    }

    initBricks();
    $("#difficultySelect").prop("disabled", true);
    $("#startBtn").prop("disabled", true);

    setupGame();

    if (!intervalId) {
        intervalId = setInterval(draw, 10); // dela vsake 10ms
    }
});


function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true); //risemo kroglo
    ctx.closePath();
    ctx.fill();
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h); //risemo ploscek
    ctx.closePath();
    ctx.fill();
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT); //izbrise use iz canvasa
}

function init_paddle() {
    paddlex = WIDTH / 2 - 50;
    paddleh = 10; //postavi ploscek
    paddlew = 100;
}

function onKeyDown(evt) {
    if (evt.keyCode == 39 || evt.keyCode == 68) rightDown = true; //pritisnes gumb se premakne
    else if (evt.keyCode == 37 || evt.keyCode == 65) leftDown = true;
}

function onKeyUp(evt) {
    if (evt.keyCode == 39 || evt.keyCode == 68) rightDown = false; //spustis gumb se neha premikat
    else if (evt.keyCode == 37 || evt.keyCode == 65) leftDown = false;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft + (wobbleDirection * 2);
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                b.x = brickX;
                b.y = brickY;
                ctx.drawImage(b.image, brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

function collisionDetection() {
    let allBricksCleared = true;
    outerLoop: //da skocimo iz vseh zank hkrati in ne samoi iaz notranje
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) { //narise sam ce je aktivna(1)
                allBricksCleared = false;
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.health--;
                    if (b.health <= 0) {
                        b.status = 0;
                        tocke += b.points;
                        $("#tocke").html(tocke);
                    }
                    break outerLoop;
                }
            }
        }
    }

    if (allBricksCleared) {
        clearInterval(intervalId);
        Swal.fire({
            title: 'Bravo!',
            text: 'Uničil si vse vsiljivce in zbral: ' + tocke + ' točk.',
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
    if (isPaused) return; //ne nadaljuje

    clear();
    ctx.fillStyle = ballcolor; //premik zoga
    circle(x, y, r);

    if (rightDown && paddlex + paddlew < WIDTH) paddlex += 5; //premik
    if (leftDown && paddlex > 0) paddlex -= 5;

    ctx.fillStyle = paddlecolor;
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh); //premik

    wobbleTimer += 10; //premikanje vesoljckov
    if (wobbleTimer >= wobbleInterval) {
        wobbleDirection *= -1;
        wobbleTimer = 0;

        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status == 1) {
                    b.image = (b.image === b.frame1) ? b.frame2 : b.frame1; //ce je oklepaj enak vrne true in nastavi b.frame2 na b.image, ce ni pa b.frame1
                }
            }
        }
    }

    drawBricks();
    collisionDetection();

    // preverjamo trke z robovi in plsckom
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
    bricks = [];
    let topRowCount, otherRowsCount;

    if (selectedDifficulty === "easy") { //racunanje koliko bo vesoljcev glede na izbrano tezavnopst (randmozied)
        topRowCount = Math.floor(Math.random() * 2) + 1;
        otherRowsCount = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
    } else if (selectedDifficulty === "normal") {
        topRowCount = Math.floor(Math.random() * 3) + 2;
        otherRowsCount = Math.floor(Math.random() * 4) + 7;
    } else if (selectedDifficulty === "hard") {
        topRowCount = Math.floor(Math.random() * (10 - 6 + 1)) + 6;
        otherRowsCount = Math.floor(Math.random() * (14 - 8 + 1)) + 8;
    }

    let topRowPositions = []; //3 vrsta
    let otherRowsPositions = []; //ostale vrste

    while (topRowPositions.length < topRowCount) {
        let pos = Math.floor(Math.random() * brickColumnCount);
        if (!topRowPositions.includes(pos)) {
            topRowPositions.push(pos); //dodamo vrednost v pos
        }
    }

    while (otherRowsPositions.length < otherRowsCount) {
        let col = Math.floor(Math.random() * brickColumnCount);
        let row = Math.floor(Math.random() * (brickRowCount - 1)) + 1;
        let key = `${col}-${row}`;//string locen z vezajem
        if (!otherRowsPositions.includes(key)) {
            otherRowsPositions.push(key);
        }
    }

    for (let c = 0; c < brickColumnCount; c++) { //stolpec
        bricks[c] = []; //tabela
        for (let r = 0; r < brickRowCount; r++) {//vrsta
            let brick = { //objekt
                x: 0,
                y: 0,
                status: 1,
                health: 1,
                frame1: brickImage1_easy,
                frame2: brickImage2_easy,
                image: brickImage1_easy,
                points: 1
            };

            if (r === 0 && topRowPositions.includes(c)) { //preveri ce je prva
                brick.frame1 = brickImage1_hard;
                brick.frame2 = brickImage2_hard;
                brick.health = 3;
                brick.points = 3;
            } else if (r > 0 && otherRowsPositions.includes(`${c}-${r}`)) { //preveri ce ni prva
                brick.frame1 = brickImage1_normal;
                brick.frame2 = brickImage2_normal;
                brick.health = 2;
                brick.points = 2;
            } else { //ostale
                brick.frame1 = brickImage1_easy;
                brick.frame2 = brickImage2_easy;
                brick.health = 1;
                brick.points = 1;
            }

            brick.image = brick.frame1;//zamenja sliki
            bricks[c][r] = brick; //shrani v tabelo na pozicijo c,r da prikaze pravilno
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
