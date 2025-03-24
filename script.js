var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballColor = "#000000"		
var ballRadius = 10;

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = ballColor; 
	ctx.fill();
	ctx.closePath();
}

var paddlex;
var paddleh;
var paddlew;

function init_paddle() {
  	paddlex = WIDTH / 2;
  	paddleh = 10;
  	paddlew = 75;
}
		
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	x += dx;
	y += dy;
	if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}
	if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
		dy = -dy;
	}
}
setInterval(draw, 5);
init_paddle();
