var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 860;
canvas.height = 560;

//Variables
var onGround = false;
var leftPressed = rightPressed = upPressed = false;
var player = new Object("../img/monster.png", 30,50,64,64);
var maxBlock = 15;
var block = new Array();
for ( var i = 0; i < 6; i++)
	block[i] = new Object ("../img/rocks.png",[i]*64,484,64,64);
block[6] = new Object ("../img/rocks.png",6*64,484-1*64,64,64);
block[7] = new Object ("../img/rocks.png",7*64,484-2*64,64,64);
for ( var i = 8; i < maxBlock; i++)
	block[i] = new Object ("../img/rocks.png",[i]*64,484,64,64);

player.V_Y = 3;


window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup" , onKeyUp);



gameLoop();

function update()
{
	movement();
	movePlayer();
	render();
}

function gameLoop() {
	setInterval(update,33.34);
}

function onKeyDown(e){
	switch(e.keyCode){
		case 65:
			leftPressed = true;
			break;
		case 68:
			rightPressed = true;
			break;
		case 87:
			upPressed = true;
			break;
	}
}

function onKeyUp(e){
	switch(e.keyCode){
		case 65:
			leftPressed = false;
			break;
		case 68:
			rightPressed = false;
			break;
		case 87:
			upPressed = false;
			break;
	}
}

function movement()
{
	player.gav = 10;

	player.X += player.V_X;
	player.Y += player.V_Y;
	if (player.V_Y < player.gav) 
		player.V_Y += player.weight;
	for ( var i = 0; i < maxBlock; i++){
		if (player.collision(block[i]) && player.Y + player.H < block[i].Y + player.V_Y){
			player.Y = block[i].Y - player.H;
			player.V_Y = 0;
		}
	}
}

function movePlayer(){
	
	if(leftPressed)
		player.V_X = -3;
	if(rightPressed)
		player.V_X = 3;
	if(!leftPressed && !rightPressed)
		player.V_X = 0;
	if (upPressed && onGround){
		player.V_Y = -10;
		onGround = false;
	}
	
}





// Set object for player and enemy
function Object(img,x,y,w,h){
	this.Sprite = new Image();
	this.Sprite.src = img;
	this.X = x;
	this.Y = y;
	this.W = w;
	this.H = h;
	this.Previous_X;
	this.Previous_Y;
	this.V_X = 0;
	this.V_Y = 0;
	this.gav = 0;
	this.weight = 0.5;
	this.collision = function(obj){
		if (this.X > obj.X + obj.W) return false;
		if (this.X + this.W < obj.X) return false;
		if (this.Y > obj.Y + obj.Y) return false;
		if (this.Y + this.H < obj.Y) return false;
		onGround = true
		return true;
	}
}

function render(){
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.drawImage(player.Sprite,player.X,player.Y);
	for ( var i = 0; i < maxBlock; i++)
		ctx.drawImage(block[i].Sprite,block[i].X,block[i].Y);
}


