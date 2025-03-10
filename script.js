var x = 150;
var y = 150;
var dx = 2;
var dy = 4;
var ctx;
var canvas;
var WIDTH;
var HEIGHT;
var r=10;
function init() {

	canvas=document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	return setInterval(draw, 10); //klic funkcije draw vsakih 10 ms; http://www.w3schools.com/jsref/met_win_setinterval.asp
	ctx = $('#canvas')[0].getContext("2d");
  WIDTH = $("#canvas").width();
  HEIGHT = $("#canvas").height();
  return setInterval(draw, 10);

}

function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}



function draw() {
	ctx.clearRect(0,0,500,700);
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
	x += dx;
	y += dy;

	clear();
	circle(x, y, 10);
	if (x + dx > WIDTH (-r)|| x + dx < 0 (+r))
	dx = -dx;
	if (y + dy > HEIGHT (-r)|| y + dy < 0 (+r))
	dy = -dy;
	x += dx;
	y += dy;

}
init();
