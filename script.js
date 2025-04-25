let isPaused = false;
let intervalId;

function drawIt() {
    var x = 308;
    var y = 400;
    var dx = 1;
    var dy = 1;
    var WIDTH;
    var HEIGHT;
    var r = 10;
    var tocke;
    var rowcolors = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"];
    var paddlecolor = "#FFFFFF";
    var ballcolor = "#FFFFFF";
    var bricks = [];
    var brickRowCount = 5;
    var brickColumnCount = 5;
    var brickWidth;
    var brickHeight = 15;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var ctx;
    var rightDown = false;
    var leftDown = false;
    var paddlex;
    var paddleh;
    var paddlew;

    function init() {
        ctx = $('#canvas')[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        brickWidth = (WIDTH - brickOffsetLeft * 2 - (brickColumnCount - 1) * brickPadding) / brickColumnCount;
        tocke = 0;
        $("#tocke").html(tocke);
        intervalId = setInterval(draw, 10);
    }

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
        if (evt.keyCode == 39 || evt.keyCode == 68)
            rightDown = true;
        else if (evt.keyCode == 37 || evt.keyCode == 65)
            leftDown = true;
    }

    function onKeyUp(evt) {
        if (evt.keyCode == 39 || evt.keyCode == 68)
            rightDown = false;
        else if (evt.keyCode == 37 || evt.keyCode == 65)
            leftDown = false;
    }

    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.fillStyle = rowcolors[r];
                    rect(brickX, brickY, brickWidth, brickHeight);
                }
            }
        }
    }

    function collisionDetection() {
        let allBricksCleared = true;  // Add this to check if all bricks are cleared

        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    allBricksCleared = false;  // If there are still bricks, set to false
                    let ballNextX = x + dx;
                    let ballNextY = y + dy;

                    let collision =
                        ballNextX + r > b.x &&
                        ballNextX - r < b.x + brickWidth &&
                        ballNextY + r > b.y &&
                        ballNextY - r < b.y + brickHeight;

                    if (collision) {
                        // Bounce based on entry direction
                        let overlapX =
                            Math.min(ballNextX + r, b.x + brickWidth) -
                            Math.max(ballNextX - r, b.x);
                        let overlapY =
                            Math.min(ballNextY + r, b.y + brickHeight) -
                            Math.max(ballNextY - r, b.y);

                        if (overlapX < overlapY) {
                            dx = -dx;
                        } else {
                            dy = -dy;
                        }

                        b.status = 0;
                        tocke += 1;
                        $("#tocke").html(tocke);
                    }
                }
            }
        }

        // If all bricks are cleared, show the SweetAlert
        if (allBricksCleared) {
            clearInterval(intervalId);  // Stop the game
            Swal.fire({
                title: 'Congratulations!',
                text: 'You cleared all the bricks and scored ' + tocke + ' points.',
                icon: 'success',
                confirmButtonText: 'Play Again',
                willClose: () => {
                    location.reload();  // Reload to restart the game
                }
            });
        }
    }

    let prevX = x;
    let prevY = y;

    function draw() {
        if (isPaused) return;

        clear();
        ctx.fillStyle = ballcolor;
        circle(x, y, r);

        if (rightDown && paddlex + paddlew < WIDTH) paddlex += 5;
        if (leftDown && paddlex > 0) paddlex -= 5;

        ctx.fillStyle = paddlecolor;
        rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

        drawBricks();
        collisionDetection();
        x += dx;
        y += dy;


        if (x + dx > WIDTH - r || x + dx < r) dx = -dx;
        if (y + dy < r) {
            dy = -dy;
        } else if (x > paddlex && x < paddlex + paddlew && y + r > HEIGHT - paddleh) {
            dy = -dy;
            let hitPos = (x - (paddlex + paddlew / 2)) / (paddlew / 2);
            dx = hitPos * 1.5; // Adjusted multiplier for slower movement
        } else if (!(x > paddlex && x < paddlex + paddlew) && y + r > HEIGHT) {
            clearInterval(intervalId);
            Swal.fire({
                title: 'Game Over!',
                text: 'You scored ' + tocke + ' points.',
                icon: 'error',
                confirmButtonText: 'Try Again',
                willClose: () => {
                    location.reload();
                }
            });
        }

        x += dx;
        y += dy;

    }

    function initBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }

    init();
    init_paddle();
    initBricks();

    $("#pauseResumeBtn").click(function () {
        if (isPaused) {
            isPaused = false;
            $(this).text("Pause");
            intervalId = setInterval(draw, 10);
        } else {
            isPaused = true;
            $(this).text("Resume");
            clearInterval(intervalId);
        }
    });
}
