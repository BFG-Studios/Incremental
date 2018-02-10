//canvas variables
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
var canvas = document.querySelector("canvas");
canvas.width = 860;
canvas.height = 560;
stageHeight = 200;
var renderer = canvas.getContext("2d");
var player = {x: 430, effectiveY: 280, realY: 280, hspeed: 5, vspeed: 2.5, left: false, right: false, back: false, forw: false , width: 64, height: 64, jump: false, attack: false};
var hitBox = {x: 0, y: 0, cooldown: 0, real: false};
var playerimg;
var attackimg;
var fakeX = 0;
var jumpInt = 0;
startFunc();

function startFunc(){
	playerimg = new Image();
	playerimg.src = "../img/Ship.png"
	attackimg = new Image();
	attackimg.src = "../img/Bullet.png"
	uInt = setInterval(update, 33.34);

}
function update(){
	playerMove();
	if (player.jump == true){
		jump();
	}
	if (player.attack == true){
		attack();
	}
	render();
}
function onKeyDown(event){
	switch (event.keyCode){
		case 65: //a moves left
			player.left = true;
			break;
		case 68: //d moves right
			player.right = true;
			break;
		case 87: //w moves back
			player.back = true;
			break;
		case 83: //s moves forward
			player.forw = true;
			break;
		case 32: //s moves forward
			player.realY = player.effectiveY;
			player.jump = true;
			fakeX = 0;
			jumpInt = 0;
			break;
		case 74: //j attack
			if (player.attack == false){
				player.attack = true;
				hitBox.real = true;
			}
			break;
	}
}
function onKeyUp(event){
	switch (event.keyCode){
		case 65: //a moves left
			player.left = false;
			break;
		case 68: //d moves right
			player.right = false;
			break;
		case 87: //w moves back
			player.back = false;
			break;
		case 83: //s moves forward
			player.forw = false;
			break;		
	}
}
function playerMove(){
	if (player.left == true && player.x > 0){
		player.x -= player.hspeed;
	}if (player.right == true && player.x + player.width < canvas.width){
		player.x += player.hspeed;
	}if (player.back == true && player.effectiveY > stageHeight){
		player.effectiveY -= player.vspeed;
		player.realY -= player.vspeed;
	}if (player.forw == true && player.effectiveY + player.height < canvas.height){
		player.effectiveY += player.vspeed;
		player.realY += player.vspeed;
	}
}
function jump(){
	jumpInt += 0.01
	fakeX += Math.PI / 100;
	player.realY -= 4*(Math.sin(fakeX));
	if (jumpInt > 2){
		player.jump = false;
	}
}
function attack(){
	console.log (hitBox.real);
	hitBox.cooldown ++;
	hitBox.x = player.x+player.width;
	hitBox.y = player.realY+(player.height/4);
	if (hitBox.cooldown == 10){
		hitBox.real = false;
	}
	if (hitBox.cooldown >= 25){
		player.attack = false;
		hitBox.cooldown = 0;
	}
}
function render(){
	renderer.clearRect(0,0,canvas.width,canvas.height);
	renderer.drawImage(playerimg,player.x,player.realY);
	if (hitBox.real == true){
		renderer.drawImage(attackimg,hitBox.x,hitBox.y);
	}
}