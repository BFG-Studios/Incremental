//CANVAS VARIABLES
window.addEventListener("click", onClick);
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup" , onKeyUp);
var canvas = document.querySelector("canvas");
canvas.width = 860;
canvas.height = 560;
var renderer = canvas.getContext("2d");
renderer.font = "20px Arial";

//INCREMENTAL VARIABLES
var newCarrot = new Plant(300,70,2);
var newPotate = new Plant(150,50,0);
var newTomato = new Plant(450,90,1);
var cG = 0; //controls the game state 0 = incremental, 1 = sidescroller, 2 = platformer, 3 = map
var seedChance = 50;
var extraChance = 0;
var goldBonus = 0;
var mapBtn; //button for opening map selections
var mapSelection; //picture for map selections
var backBtn; //button for back to incremental level
var xImg;
var harvest = new Audio('../wav/Harvest.wav');
var bonus = new Audio('../wav/Bonus.wav');
var planting = new Audio('../wav/Planting.wav');
var baseImg;
var shopImg;
var sellImg;
var buyImg;
var eatImg;
var pbImg;
var tbImg;
var cbImg;
var plusImg;
var minusImg;
var selRender;
var selX = 1000;
var selY = 1000;
var selPosY = [160,200,240];
var selPosX = 490;
var statName = ["Dex: ", "Int: ", "Cha: "];
var stats = [0,0,0]; // dex,int,cha
var gold = 0;
var selected = 3;
var seedT;
var plantT;
var statsT;
var goldT;
var seeds = [5,5,5]; //potato,tomato,carrot
var plants = [0,0,0]; //potato,tomato,carrot
var tabs = 0;
var shopY = [50,100,150,200,250,300,350,400];
var shopItemsX = 50;
var invItemsX = 550;
var storeT;
var storeStrings = ["Potato Seed","Tomato Seed","Carrot Seed","Potato Plant","Tomato Plant","Carrot Plant"];
var storeSeed = 0;
var storePlant = 0;
var dexTab;
var intTab;
var chaTab; //shop tabs for plants
var leftArrow; //left arrow for shop
var rightArrow; //right arrow for shop

function Plant(growTime,harvestChance,plantId){

	this.gT = growTime;
	this.hC = harvestChance;
	this.pId = plantId;
}
//===========================================================================================
//SIDESCROLLER VARIABLES
stageHeight = 200;
var renderer = canvas.getContext("2d");
var sdcPlayer = {dmg: 1 + stats[1] /* how much dmg the player does*/, blockRt: 0 + stats[2]/*chance to block*/,x: 430, effectiveY: 280, realY: 280, hspeed: 5 + stats[0]/* adds dex to horizontal move speed*/, vspeed: 2.5 + stats[0]/* adds dex to vertical move speed*/, left: false, right: false, back: false, forw: false , width: 64, height: 64, jump: false, attack: false};
var hitBox = {x: 0, y: 0, cooldown: 0, real: false};
var playerimg;
var attackimg;
var fakeX = 0;
var jumpInt = 0;
//===========================================================================================
//PLATFORMER VARIABLES

var onGround = false;
var leftPressed = rightPressed = upPressed = false;
var pltPlayer = new Object("../img/monster.png", 30,50,64,64);
var maxBlock = 15;
var block = new Array();
for ( var i = 0; i < 6; i++)
	block[i] = new Object ("../img/rocks.png",[i]*64,484,64,64);
block[6] = new Object ("../img/rocks.png",6*64,484-1*64,64,64);
block[7] = new Object ("../img/rocks.png",7*64,484-2*64,64,64);
block[8] = new Object ("../img/rocks.png",8*64,484-3*64,64,64);
block[9] = new Object ("../img/rocks.png",9*64,484-4*64,64,64);
for ( var i = 10; i < maxBlock; i++)
	block[i] = new Object ("../img/rocks.png",[i]*64,484,64,64);
	block[12] = new Object ("../img/rocks.png",12*64,484-6*64,64,64);
pltPlayer.V_Y = 3;
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
//===========================================================================================

startFunc();
//INITIALIZATION
function startFunc(){
	//INCREMENTAL INITIALIZATION
	backBtn = new Image; //picture for back button in platform & side scroll
	mapBtn = new Image;
	mapSelection = new Image;
	xImg = new Image; // picture for x button
	baseImg = new Image; //picture for dirt
	shopImg = new Image; // picture for shop button
	sellImg = new Image; //pic for sell button
	buyImg = new Image; //pic for buy button
	eatImg = new Image; //pic for eat button
	pbImg = new Image; //pic for potato select button
	tbImg = new Image; //pic for tomato select button
	cbImg = new Image; // pic for carrot select button
	selRender = new Image; //pic for the border around selected plant
	plusImg = new Image; //pic for plus button
	minusImg = new Image; //pic for minus button
	dexTab = new Image;
	intTab = new Image;
	chaTab = new Image; //tabs for shop
	shopTab = new Image; // picture for shop tab
	farmTab = new Image; // picture for farm tab
	mapTab = new Image; // picture for map tab
	leftArrow = new Image;
	rightArrow = new Image;
	leftArrow.src = "../img/LeftArrow.png";
	rightArrow.src = "../img/RightArrow.png";
	shopTab.src = "../img/ShopTab.png";
	farmTab.src = "../img/FarmTab.png";
	mapTab.src = "../img/MapTab.png";
	xImg.src = "../img/XButton.png";
	backBtn.src = "../img/BackBtn.png";
	mapBtn.src = "../img/map.png";
	mapSelection.src = "../img/selections.png";
	baseImg.src = "../img/Soil2.png";
	sellImg.src = "../img/Sell.png";
	buyImg.src = "../img/Buy.png";
	eatImg.src = "../img/Eat.png";
	pbImg.src = "../img/PotatoButton.png";
	tbImg.src = "../img/TomatoButton.png";
	cbImg.src = "../img/CarrotButton.png";
	selRender.src = "../img/Border.png";
	plusImg.src = "../img/PlusButton.png";
	minusImg.src = "../img/MinusButton.png";
	dexTab.src = "../img/DexTab.png";
	intTab.src = "../img/IntTab.png";
	chaTab.src = "../img/ChaTab.png"; //tabs for shop
	plantImg = []; //the array that stores the various plant pictures, it's an array so i don't have to use a million if statements
	plantImg[0] = []; //this makes it multidimensional
	plantImg[1] = [];
	plantImg[2] = [];
	for (i = 0; i < 4; i++){ //this fills each line with 4 empty images
		var potImg = new Image;
		var tomImg = new Image;
		var carImg = new Image;
		plantImg[1][i] = tomImg;
		plantImg[2][i] = carImg;
		plantImg[0][i] = potImg;
	}
	plantImg[0][0].src = "../img/Plant0_2.png"; // these are the src for each plant's life cycle, 0 is potato, 1 is tomato, 2 is carrot
	plantImg[1][0].src = "../img/Plant0_2.png";
	plantImg[2][0].src = "../img/Plant0_2.png";
	plantImg[0][1].src = "../img/Plant1_2.png";
	plantImg[1][1].src = "../img/Plant1_2.png";
	plantImg[2][1].src = "../img/Plant1_2.png";
	plantImg[0][2].src = "../img/Plant2_2.png";
	plantImg[1][2].src = "../img/Plant2_2.png";
	plantImg[2][2].src = "../img/Plant2_2.png";
	plantImg[0][3].src = "../img/Potato2.png";
	plantImg[1][3].src = "../img/Tomato2.png";
	plantImg[2][3].src = "../img/Carrot2.png";
	farmPlot = [];
	for (i = 0; i < 4; i++){ //this stuff populates the farm/field player can grow shit on
		farmPlot[i] = [];
		for (j = 0; j < 4; j++){
			var square = {};
			square.x = i*64+10;
			square.y = j*64+10;
			square.img = baseImg;
			square.seed = 3;
			square.growing = false;
			square.harvest = false;
			square.tick = 0;
			square.grow = 0;
			farmPlot[i][j] = square;
		}
	}
	//=======================================================================================
	//SIDESCROLLER
	playerimg = new Image();
	playerimg.src = "../img/Ship.png"
	attackimg = new Image();
	attackimg.src = "../img/Bullet.png"
	//=======================================================================================
	uInt = setInterval(update, 33.34);
}
//===========================================================================================
//GENERAL CODE BLOCK
function update(){
	switch (cG){
		case 0: //incremental
			for (i = 0; i < 4; i++){
				for (j = 0; j < 4; j++){
					if (farmPlot[i][j].growing == true){
						growUp(farmPlot[i][j]);
					}
				}
			}
			break;
		case 1: //sidescroller
			playerMove();
			if (sdcPlayer.jump == true){
				jump();
			}
			if (sdcPlayer.attack == true){
				attack();
			}
			break;
		case 2: //platformer
			movement();
			movePlayer();
			areaTreasure();
			break;
		case 3: //map

			break;
	}
	render();
}
function onKeyDown(e){
	switch(e.keyCode){
		case 65:
			leftPressed = true;
			sdcPlayer.left = true;
			break;
		case 68:
			rightPressed = true;
			sdcPlayer.right = true;
			break;
		case 87:
			upPressed = true;
			sdcPlayer.back = true;
			break;
		case 83: //s moves forward
			sdcPlayer.forw = true;
			break;
		case 32: //jump
			sdcPlayer.realY = sdcPlayer.effectiveY;
			sdcPlayer.jump = true;
			fakeX = 0;
			jumpInt = 0;
			break;
		case 74: //j attack
			if (sdcPlayer.attack == false){
				sdcPlayer.attack = true;
				hitBox.real = true;
			}
			break;
	}
}

function onKeyUp(e){
	switch(e.keyCode){
		case 65:
			leftPressed = false;
			sdcPlayer.left = false;
			break;
		case 68:
			rightPressed = false;
			sdcPlayer.right = false;
			break;
		case 87:
			upPressed = false;
			sdcPlayer.back = false;
			break;
		case 83: //s moves forward
			sdcPlayer.forw = false;
			break;
	}
}
function onClick(e){
	var xClick = e.pageX - canvas.offsetLeft;
	var yClick = e.pageY - canvas.offsetTop;
	switch (cG){
		case 0:
		if (tabs == 0){
			if (xClick > 470 && xClick < 590 && yClick > 290 && yClick << 315)
			{
				 cG = 3;
			}
			if (xClick > 10 && xClick < 266){ // checks if they clicked inside the farm space
				if (yClick > 10 && yClick < 266){
					for (i = 0; i < 4; i++){
						if (xClick > farmPlot[i][0].x && xClick < farmPlot[i][0].x+64){ // checks for the individual square they clicked on
							for (j = 0; j < 4; j++){
								if (yClick > farmPlot[i][j].y && yClick < farmPlot[i][j].y+64){
									if (farmPlot[i][j].growing == false && farmPlot[i][j].harvest == false && selected != 3 && seeds[selected] > 0){ // checks if the square is empty and tells that square to grow
										farmPlot[i][j].seed = selected;
										farmPlot[i][j].growing = true;
										farmPlot[i][j].img = plantImg[selected][0];
										seeds[selected] -= 1; // removes the selected seed type from player inventory
										planting.play();
									}
									if (farmPlot[i][j].harvest == true){ //checks if the square is harvestable, takes the plant into the inventory and returns to it's start state

										if (Math.random()*100 < seedChance){
											seeds[farmPlot[i][j].seed] += 1;
											bonus.play();
										}/* has a chance to gain an extra seed of the type harvested*/

										if (Math.random()*100 < extraChance){
											plants[farmPlot[i][j].seed] += 1;
											bonus.play();
										}/*chance to gain a second plant of the type harvested*/

										plants[farmPlot[i][j].seed] += 1;
										farmPlot[i][j].harvest = false;
										farmPlot[i][j].seed = 3;
										farmPlot[i][j].img = baseImg;
										farmPlot[i][j].grow = 0;
										harvest.play();
									}
								}
							}
						}
					}
				}
			}
			if(xClick > 490 && xClick < 550){ // check if they clicked the shop button
				if (yClick > 0 && yClick < 30){
					shop = 1;
				}
			}
			if(xClick > 490 && xClick < 550){ // check if they clicked the sell button
				if (yClick > 30 && yClick < 60){
					if (selected != 3 && plants[selected] > 0){ // if they have a plant selected and have a plant to sell, sell it
						plants[selected] -= 1;
						gold += 50  + goldBonus;/*incorporated chr to increase sell value by 10 for each chr point*/
					}
				}
			}
			if(xClick > 490 && xClick < 550){ // check if they clicked the buy button
				if (yClick > 60 && yClick < 90){
					if (selected != 3 && gold > 0){ // if they have a plant selected, and enough gold to buy a plant, buy it
						seeds[selected]++;
						gold -= 25 - Math.floor(stats[2]/2);/*incorporated chr to decrease purchase value by 1 per 2 chr*/
					}
				}
			}
			if(xClick > 490 && xClick < 550){ // check if they clicked the eat button
				if (yClick > 90 && yClick < 120){
					if (selected != 3 && plants[selected] > 0){ // if they have a plant selected, and a plant to eat, eat it
						plants[selected] -= 1;
						stats[selected] += 1;
					}
				}
			}
			if(xClick > 490 && xClick < 550){
				if (yClick > 160 && yClick < 190){ //check if they clicked the potato button and select potatoes if so
					selected = 0;
					selX = selPosX;
					selY = selPosY[selected]; // all three of these also move the highlight image around the button
				}
			}
			if(xClick > 490 && xClick < 550){
				if (yClick > 200 && yClick < 230){ //check if they clicked the tomato button and select tomatoes if so
					selected = 1;
					selX = selPosX;
					selY = selPosY[selected];
				}
			}
			if(xClick > 490 && xClick < 550){
				if (yClick > 240 && yClick < 270){ //check if they clicked the carrot button and select carrots if so
					selected = 2;
					selX = selPosX;
					selY = selPosY[selected];
				}
			}
			//menu selection
			if (yClick > 510 && yClick < 560){ 
				if(xClick > 0 && xClick < 100){ //click farm tab
					tabs = 0;
					stage.style.backgroundColor = "#202316";
				}
				else if(xClick > 100 && xClick < 200){//click shop tab
					tabs = 1;
					stage.style.backgroundColor = "white";
				}
				else if(xClick > 200 && xClick < 300){//click map tab
					tabs = 2;
					stage.style.backgroundColor = "yellow";
				}
			}
		}
		//IN SHOP //shopitems = 50 shopy[6] = 350
			if (tabs== 1){ 
				if (yClick > 320 && yClick < 384) {
					if (xClick > 50 && xClick < 114) { //potato click
						selected = 0;
					}
					else if (xClick > 118.3 && xClick < 182.3) { //tomato click
						selected = 1;
					}
					else if (xClick > 186.6 && xClick < 250.6) { //carrot click
						selected = 2;
					}
					else {
						selected = -1;
					}
				}
				if(xClick > 50 && xClick < 110){ // check if they clicked the buy button
				if (yClick > 390 && yClick < 420){
					if (selected != 3 && gold > 0){ // if they have a plant selected, and enough gold to buy a plant, buy it
						seeds[selected]++;
						gold -= 25 - Math.floor(stats[2]/2);/*incorporated chr to decrease purchase value by 1 per 2 chr*/
					}
				}
			}
				if(xClick > 120 && xClick < 180){ // check if they clicked the sell button
				if (yClick > 390 && yClick < 420){
					if (selected != 3 && plants[selected] > 0){ // if they have a plant selected and have a plant to sell, sell it
						plants[selected] -= 1;
						gold += 50  + goldBonus;/*incorporated chr to increase sell value by 10 for each chr point*/
					}
				}
			}
				if(xClick > 190 && xClick < 250){ // check if they clicked the eat button
				if (yClick > 390 && yClick < 420){
					if (selected != 3 && plants[selected] > 0){ // if they have a plant selected, and a plant to eat, eat it
						plants[selected] -= 1;
						stats[selected] += 1;
					}
				}
			}
			//menu selection
				if (yClick > 510 && yClick < 560){ 
				if(xClick > 0 && xClick < 100){ //click farm tab
					tabs = 0;
					stage.style.backgroundColor = "#202316";
				}
				else if(xClick > 100 && xClick < 200){//click shop tab
					tabs = 1;
					stage.style.backgroundColor = "white";
				}
				else if(xClick > 200 && xClick < 300){//click map tab
					tabs = 2;
					stage.style.backgroundColor = "yellow";
				}
				}
				//renderer.drawImage(dexTab,50,100);
				//renderer.drawImage(intTab,120,100);
				//renderer.drawImage(chaTab,190,100);
				if(yClick > 100 && yClick < 140){
				if(xClick > 50 && xClick <114){
					selected = 0;
					//dexTab.src = "../img/DexTabSel.png";
				}
				else if(xClick > 120 && xClick < 184) {
					selected = 1;
				}
				else if(xClick > 190 && xClick < 254) {
					selected = 2;
				}
				else {
					selected = -1;
				} //dex int cha tabs
			}
			}
			//IN MAP
			if (tabs == 2){
			//menu selection
			if (yClick > 510 && yClick < 560){ 
				if(xClick > 0 && xClick < 100){ //click farm tab
					tabs = 0;
					stage.style.backgroundColor = "#202316";
				}
				else if(xClick > 100 && xClick < 200){//click shop tab
					tabs = 1;
					stage.style.backgroundColor = "white";
				}
				else if(xClick > 200 && xClick < 300){//click map tab
					tabs = 2;
					stage.style.backgroundColor = "yellow";
				}
			}
			}
			break;
		case 1:
            if (xClick > 10 && xClick < 130 && yClick > 10 && yClick < 50){//back to incremental level
			    cG = 0;
			}
			break;
		case 2:
		    if (xClick > 10 && xClick < 130 && yClick > 10 && yClick < 50){//back to incremental level
			    cG = 0;
			}
			break;
		case 3:
			if (xClick > 250 && xClick < 710 && yClick > 160 && yClick < 240){ //platformer transition
				cG = 2;
			}
			if (xClick > 250 && xClick < 710 && yClick > 240 && yClick < 320){ //sidescroller transition
				cG = 1;
			}
			if (xClick > 250 && xClick < 710 && yClick > 320 && yClick < 400){ // exit back to incremental
				cG = 0;
			}
			break;
	}
}
//===========================================================================================
//INCREMENTAL CODE BLOCK
function growUp(plot){
	plot.tick++;
	if (plot.tick == 120){
		plot.grow++;
		plot.img = plantImg[plot.seed][plot.grow];
		plot.tick = 0;
		if (plot.grow == 3){
			plot.harvest = true;
			plot.growing = false;
		}
	}

}

//===========================================================================================
//SIDESCROLLER CODE BLOCK
function playerMove(){
	if (sdcPlayer.left == true && sdcPlayer.x > 0){
		sdcPlayer.x -= sdcPlayer.hspeed;
	}if (sdcPlayer.right == true && sdcPlayer.x + sdcPlayer.width < canvas.width){
		sdcPlayer.x += sdcPlayer.hspeed;
	}if (sdcPlayer.back == true && sdcPlayer.effectiveY > stageHeight){
		sdcPlayer.effectiveY -= sdcPlayer.vspeed;
		sdcPlayer.realY -= sdcPlayer.vspeed;
	}if (sdcPlayer.forw == true && sdcPlayer.effectiveY + sdcPlayer.height < canvas.height){
		sdcPlayer.effectiveY += sdcPlayer.vspeed;
		sdcPlayer.realY += sdcPlayer.vspeed;
	}
}
function jump(){
	jumpInt += 0.01
	fakeX += Math.PI / 100;
	sdcPlayer.realY -= 4*(Math.sin(fakeX));
	if (jumpInt > 2){
		sdcPlayer.jump = false;
	}
}
function attack(){
	console.log (hitBox.real);
	hitBox.cooldown ++;
	hitBox.x = sdcPlayer.x+sdcPlayer.width;
	hitBox.y = sdcPlayer.realY+(sdcPlayer.height/4);
	if (hitBox.cooldown == 10){
		hitBox.real = false;
	}
	if (hitBox.cooldown >= 25){
		sdcPlayer.attack = false;
		hitBox.cooldown = 0;
	}
}
//===========================================================================================
//PLATFORMER CODE BLOCK
function movement()
{
	pltPlayer.gav = 10;

	pltPlayer.X += pltPlayer.V_X;
	pltPlayer.Y += pltPlayer.V_Y;
	if (pltPlayer.V_Y < pltPlayer.gav)
		pltPlayer.V_Y += pltPlayer.weight;
	for ( var i = 0; i < maxBlock; i++){
		if (pltPlayer.collision(block[i]) && pltPlayer.Y + pltPlayer.H < block[i].Y + pltPlayer.V_Y){
			pltPlayer.Y = block[i].Y - pltPlayer.H;
			pltPlayer.V_Y = 0;
		}
	}
}
function movePlayer()
{
	if(leftPressed)
		pltPlayer.V_X = -3;
	if(rightPressed)
		pltPlayer.V_X = 3;
	if(!leftPressed && !rightPressed)
		pltPlayer.V_X = 0;
	if (upPressed && onGround){
		pltPlayer.V_Y = -10;
		console.log(pltPlayer.X);
		console.log(pltPlayer.Y);
		onGround = false;
	}

}
function areaTreasure()
{

	
		
	if (pltPlayer.X == 762 && pltPlayer.Y == 36)
	{
		leftPressed = rightPressed = upPressed = false;
		console.log("Win");
		window.alert("You found some Gold!");
		gold += 50;
		cG = 0;
		ouch = true;
		winCtr();
	}
		

}
function winCtr()
{
	var winCtr
	winCtr++
	if (winCtr = 1)
	{
		pltPlayer.X = 100;
		pltPlayer.Y = 100;
		winCtr = 0;
		console.log("hi");
		ouch = false;
		
	}
}
//===========================================================================================
//RENDER
function render(){
	renderer.clearRect(0,0,canvas.width,canvas.height);
	switch (cG){
		case 0:
			renderer.drawImage(farmTab,0,510); //tabs sized 100,50
			renderer.drawImage(shopTab,100,510);
			renderer.drawImage(mapTab,200,510); //all tabs
			renderer.drawImage(sellImg,490,30); // draws all the buttons
			renderer.drawImage(buyImg,490,60);
			renderer.drawImage(eatImg,490,90);
			renderer.drawImage(pbImg,selPosX,selPosY[0]);
			renderer.drawImage(tbImg,selPosX,selPosY[1]);
			renderer.drawImage(cbImg,selPosX,selPosY[2]);
			renderer.drawImage(selRender,selX,selY);
			renderer.drawImage(mapBtn,460,290);
			renderer.fillText("Seeds",selPosX-50,selPosY[0]-10);
			renderer.fillText("Plants",selPosX+60,selPosY[0]-10);
			for (i = 0; i < 3; i++){ // draws the number of seeds and number of plants on the screen as well as the player stats
				seedT = seeds[i].toString();
				plantT = plants[i].toString();
				statsT = stats[i].toString();
				renderer.fillText(seedT,selPosX-25,selPosY[i]+20);
				renderer.fillText(plantT,selPosX+65,selPosY[i]+20);
				renderer.fillText(statName[i],selPosX,selPosY[i]+200);
				renderer.fillText(statsT,selPosX+50,selPosY[i]+200);
			}
			goldT = gold.toString();
			renderer.fillText("Gold: ",selPosX,selPosY[2]+240);
			renderer.fillText(goldT, selPosX+50,selPosY[2]+240);
			for (i = 0; i < 4; i++){ //draws the farm plots
				for (j = 0; j < 4; j++){
					renderer.drawImage(farmPlot[i][j].img,farmPlot[i][j].x,farmPlot[i][j].y);
				}
			}
			if (tabs == 1){
				goldT = gold.toString();
				renderer.clearRect(0,0,canvas.width,canvas.height);
				stage.style.backgroundColor = "white";
				renderer.fillText("Gold: "+goldT,invItemsX,shopY[7]);
				renderer.fillText("Store",shopItemsX,shopY[0]);
				renderer.fillText("Inventory",invItemsX,shopY[0]);
				renderer.drawImage(farmTab,0,510); //tabs sized 100,50
				renderer.drawImage(shopTab,100,510);
				renderer.drawImage(mapTab,200,510); //all tabs
				renderer.drawImage(dexTab,50,100);
				renderer.drawImage(intTab,120,100);
				renderer.drawImage(chaTab,190,100);//stats tabs
				renderer.drawImage(buyImg,shopItemsX,shopY[6]+40);
				renderer.drawImage(selRender,shopItemsX,shopY[6]+40); //buy button
				renderer.drawImage(sellImg,shopItemsX+70,shopY[6]+40);
				renderer.drawImage(selRender,shopItemsX+70,shopY[6]+40); //sell button
				renderer.drawImage(eatImg,shopItemsX+140,shopY[6]+40);
				renderer.drawImage(selRender,shopItemsX+140,shopY[6]+40); //eat button
				renderer.drawImage(leftArrow,75,222); //left arrow
				renderer.drawImage(rightArrow,189,222); //right arrow
				//renderer.drawImage(plantImg[0][3],shopItemsX,shopY[6]-30); //potato
				//renderer.drawImage(plantImg[1][3],shopItemsX+68.3,shopY[6]-30); //tomato
				//renderer.drawImage(plantImg[2][3],shopItemsX+136.6,shopY[6]-30); //carrot
				if (selected == 0) {
				renderer.fillText("Potato",120,300);
				dexTab.src = "../img/DexTabSel.png";
				intTab.src = "../img/IntTab.png";
				chaTab.src = "../img/ChaTab.png";
				renderer.drawImage(plantImg[0][3],120,210); //potato
				}
				else if (selected == 1) {
				renderer.fillText("Tomato",120,300);
				intTab.src = "../img/IntTabSel.png";
				dexTab.src = "../img/DexTab.png";
				chaTab.src = "../img/ChaTab.png";
				renderer.drawImage(plantImg[1][3],120,210); //tomato
				}
				else if (selected == 2) {
				renderer.fillText("Carrot",120,300);
				chaTab.src = "../img/ChaTabSel.png";
				dexTab.src = "../img/DexTab.png";
				intTab.src = "../img/IntTab.png";
				renderer.drawImage(plantImg[2][3],120,210); //carrot
				}
				for (i = 0; i < 6; i++){
				storeT = storeStrings[i].toString();
				renderer.fillText(storeT,invItemsX,shopY[i+1]); //inventory strings
				}
				for (i = 0; i < 6; i++){
				seedT = seeds[i].toString();
				plantT = plants[i].toString();
				renderer.fillText(seedT,invItemsX+225,shopY[i+1]);
				renderer.fillText(plantT,invItemsX+225,shopY[i+1]+150);
				}
			}
			if (tabs == 2) {
				renderer.clearRect(0,0,canvas.width,canvas.height);
				renderer.drawImage(farmTab,0,510); //tabs sized 100,50
				renderer.drawImage(shopTab,100,510);
				renderer.drawImage(mapTab,200,510); //all tabs
			}
			break;
		case 1:
			renderer.clearRect(0,0,canvas.width,canvas.height);
			renderer.drawImage(playerimg,sdcPlayer.x,sdcPlayer.realY);
			renderer.drawImage(backBtn,10,10);
			if (hitBox.real == true){
				renderer.drawImage(attackimg,hitBox.x,hitBox.y);
			}
			break;
		case 2:
			renderer.drawImage(pltPlayer.Sprite,pltPlayer.X,pltPlayer.Y);
			renderer.drawImage(backBtn,10,10);
				for ( var i = 0; i < maxBlock; i++)
					renderer.drawImage(block[i].Sprite,block[i].X,block[i].Y);
			break;
		case 3:
			renderer.drawImage(mapSelection,250,160);
			break;
	}
}
