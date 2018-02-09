//canvas variables
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
var canvas = document.querySelector("canvas");
canvas.width = 860;
canvas.height = 560;
stageHeight = 200;
var renderer = canvas.getContext("2d");
var player = {x: 430, effectiveY: 280, realY: 280, hspeed: 5, vspeed: 2.5, left: false, right: false, back: false, forw: false , width: 64, height: 64, jump: false, shoot: false};
var bulletCount = [];
var bulletChoice = 0;
var bulletTimer = 0;
var playerimg;
var bulletimg;
var fakeX = 0;
var jumpInt = 0;
startFunc();

function startFunc(){
	playerimg = new Image();
	playerimg.src = "../img/Ship.png"
	bulletimg = new Image();
	bulletimg.src = "../img/Bullet.png"
	uInt = setInterval(update, 33.34);
	for (i = 0; i < 5; i++){
		var bullet = {};
		bullet.x = player.x;
		bullet.y = player.effectiveY;
		bullet.show = false;
		bullet.damage = 5;
		bulletCount[i] = bullet;
	}
}
function update(){
	playerMove();
	if (player.jump == true){
		jump();
	}
	if (player.jump == false && player.shoot == true){
		shoot();
	}
	bulletRender();
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
		case 74: //j shoots
			player.shoot = true;
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
		case 74: //j shoots
			player.shoot = false;
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
function shoot(){
	bulletTimer++;
	if (bulletTimer > 30){
		bulletCount[bulletChoice].x = player.x+16;
		bulletCount[bulletChoice].y = player.effectiveY+16;
		bulletCount[bulletChoice].show = true;
		bulletChoice++;
		if (bulletChoice > 4){
			bulletChoice = 0;
		}
		bulletTimer = 0;
	}
}
function bulletRender(){
	for (i = 0; i < 5; i++){
		if (bulletCount[i].show == true){
			bulletCount[i].x += 2;
			if (bulletCount[i].x > canvas.width){
				bulletCount[i].show = false;
			}
		}
	}
}
function render(){
	renderer.clearRect(0,0,canvas.width,canvas.height);
	for (i = 0; i < 5; i ++){
		if (bulletCount[i].show == true){
			renderer.drawImage(bulletimg,bulletCount[i].x, bulletCount[i].y);
		}
	}
	renderer.drawImage(playerimg,player.x,player.realY);
}