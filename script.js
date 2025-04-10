function drawIt() {
    var x = 200;
    var y = 100;
    var dx = 2;
    var dy = 4;
    var WIDTH;
    var HEIGHT;
    var r = 10;
    var tocke; 
    var rowcolors = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", " #FFFFFF"];
    var paddlecolor = "#FFFFFF";
    var ballcolor = "#FFFFFF";
    var bricks;
    var NROWS;
    var NCOLS;
    var BRICKWIDTH;
    var BRICKHEIGHT;
    var PADDING;
    var ctx;
    let intervalId;
    var rightDown = false;
    var leftDown = false;
    var paddlex;
    var paddleh;
    var paddlew;

    function init() {
        ctx = $('#canvas')[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        tocke = 0;
        $("#tocke").html(tocke);
        return intervalId = setInterval(draw, 10);
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
    //END LIBRARY CODE
    function init_paddle() {
        paddlex = WIDTH/2;
        paddleh = 10;
        paddlew = 100;
    }
    //nastavljanje leve in desne tipke
    function onKeyDown(evt) {
        if (evt.keyCode == 39 || evt.keyCode == 68)
            rightDown = true;
        else if (evt.keyCode == 37 || evt.keyCode == 65) leftDown = true;
    }

    function onKeyUp(evt) { //65 = a, 68 = d 
        if (evt.keyCode == 39 || evt.keyCode == 68)
            rightDown = false;
        else if (evt.keyCode == 37 || evt.keyCode == 65) leftDown = false;
    }
    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);

    function draw() {

        clear();
        ctx.fillStyle = "white";
        circle(x, y, 10);
        //premik ploščice levo in desno
        if (rightDown) {
            if ((paddlex + paddlew) < WIDTH) {
                paddlex += 5;
            } else {
                paddlex = WIDTH - paddlew;
            }
        }
        else if (leftDown) {
            if (paddlex > 0) {
                paddlex -= 5;
            } else {
                paddlex = 0;
            }
        }
        rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

        for (i=0; i < NROWS; i++) {
            ctx.fillStyle = rowcolors[i]; //barvanje vrstic
            for (j=0; j < NCOLS; j++) {
              if(bricks[i][j] == 1) ctx.fillStyle = "white";
              if(bricks[i][j] == 2) ctx.fillStyle = "red";
              if(bricks[i][j] == 3) ctx.fillStyle = "black";
              if (bricks[i][j] > 0) {
                rect((j * (BRICKWIDTH + PADDING)) + PADDING,
                    (i * (BRICKHEIGHT + PADDING)) + PADDING,
                    BRICKWIDTH, BRICKHEIGHT);
              }
            }
          }
        
        //riši opeke
        /*for (i = 0; i < NROWS; i++) {
            for (j = 0; j < NCOLS; j++) {
                if (bricks[i][j] == 1) {
                    rect((j * (BRICKWIDTH + PADDING)) + PADDING,
                        (i * (BRICKHEIGHT + PADDING)) + PADDING,
                        BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }*/

        rowheight = BRICKHEIGHT + PADDING  / 2; //Smo zadeli opeko?
        colwidth = BRICKWIDTH + PADDING  / 2;
        row = Math.floor(y / rowheight);
        col = Math.floor(x / colwidth);
        //Če smo zadeli opeko, vrni povratno kroglo in označi v tabeli, da opeke ni več
        if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] > 0) {
            dy = -dy;
            bricks[row][col]--;
            
            // Dodaj tocko ko je true
            if (bricks[row][col] === 0) {
                tocke += 1;
                $("#tocke").html(tocke);
            }
        }
        if (x + dx > WIDTH - r || x + dx <  r)
            dx = -dx;
        if (y + dy < 0 + r)
            dy = -dy;
        else if (x > paddlex && x < paddlex + paddlew && y > canvas.height - paddleh - r) {
            dy = -dy ;
            dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
            console.log("hit on paddle");
        } else if (!(x > paddlex && x < paddlex + paddlew) && y > canvas.height - r) {

            clearInterval(intervalId);
            drawGameOver();
        }
        x += dx;
        y += dy;
    }

    function initbricks() { //inicializacija opek - polnjenje v tabelo
        NROWS = 5;
        NCOLS = 5;
        BRICKWIDTH = (WIDTH / NCOLS) - 1;
        BRICKHEIGHT = 15;
        PADDING = 1;
        bricks = new Array(NROWS);
        for (var i = 0; i < NROWS; i++) {
            bricks[i] = new Array(NCOLS);
            for (var j = 0; j < NCOLS; j++) {
                if(i==j || i+j==NROWS-1) bricks[i][j] = 2;
                else if(bricks[i][j] = 1) bricks[i][j] = 3;
                
            }
        }
    }
    init();
    init_paddle();
    initbricks();
}

