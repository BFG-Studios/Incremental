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
//player related/ miscellaneous variables
var seedChance = 50;
var extraChance = 0;
var goldBonus = 0;
var harvest = new Audio("../wav/Harvest.wav"); //audio variables
var bonus = new Audio("../wav/Bonus.wav");
var planting = new Audio("../wav/Planting.wav");
var baseImg; //soil image;
var farmSize = {x:10, xw:266, y:10, yh:266}; //for checking if they've clicked on the farm
var farmPlot = [];
var selposX = 490; //these variables are for highlighting the currently selected plant
var selposY = [160,200,240];
var selX = 1000;
var selY = 1000;
var selRender; //selected plant variables stop here
var statName = ["Dex: ","Int: ","Cha: "];
var stats = [0,0,0]; //the three stats
var gold = 0; //player gold
var selected = plantNull; //which plant is selected
var tab = 0; //tracks the current tab of the player
var cG = 0;
//bunch of shop code i dunno what the fuck to do with
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
//--------------------------------------------
//plant function and plant related variables
var plantHolder = []; //array for calling plants by id
function Plant(gt,id,img,stat,price,sell,seed){
	this.gt = gt; //dictates interval the plant will change growstates at
	this.img = [];
	this.img[0] = new Image();
	this.img[1] = new Image();
	this.img[2] = new Image();
	this.img[3] = new Image(); //the final image of the grown plant
	this.img[0].src = "../img/P0.png"
	this.img[1].src = "../img/P1.png"
	this.img[2].src = "../img/P2.png"
	this.img[3].src = img;
	this.stat = stat; //the stat affected by this plant (0:dex, 1:int, 2:cha)
	this.price = price; //the price to buy this type of plant
	this.sell = sell; //the amount this plant sells for
	this.seed = seed; //number of seeds of this plant type
	this.plant = 0; //number of full grown plants of this plant type
	plantHolder[id] = this; //id for calling each plant type by #
}
//PLANT TYPE INSTANTIATION
 //growtime, plantid, final growth source, stat affected (by #id), buy price, sell price, number of seeds
var potato = new Plant(120,0,"../img/potato.png",0,5,25,5);
var tomato = new Plant(120,1,"../img/tomato.png",1,5,25,5);
var carrot = new Plant(120,2,"../img/carrot.png",2,5,25,5);

var plantNull = plantHolder.length + 1; //variable for selected to store a nonexsistant plant (for when player selects nothing)
//============================================
//--------------------------------------------
//button function and button related variables
var buttonRender = []; //array for calling buttons by id
function Button(id,x,y,w,h,cG,tab,tB,text,textX,textY,img){
	this.img = new Image(); //basic image for the button
	this.imgP = new Image(); //image for when the button is pressed
	this.img.src = img;
	this.x = x; //x coordinate
	this.y = y; //y coordinate
	this.w = w; //width of the button
	this.h = h; //height of the button
	this.xw = x + w; //the bottom x coordinate
	this.yh = y + h; //the bottom y coordinate
	this.cG = cG; //game state to load the button in
	this.tab = tab; //tab to load the button in
	this.textBool = tB //for stating whether a button has in render text over it
	this.text = text; //for rendering text on the button;
	this.tX = textX; //for editing placement of text on a button
	this.tY = textY;
	buttonRender[id] = this; //for rendering and discerning different buttons via #
}
function textUpdate(button,newText){
	button.text = newText;
}
//BUTTON INTANTIATION
//button id, x, y, width, height, gamestate, tab, render text bool, render text, render text x and y, base image
var backBtnSdc = new Button(0,10,10,120,40,1,0,false,0,0,0,"../img/BackBtn.png"); 
var backBtnPlt = new Button(1,10,10,120,40,2,0,false,0,0,0,"../img/BackBtn.png");
var mapBtn = new Button(2,460,290,120,25,0,0,false,0,0,0,"../img/map.png");
var mapSelBtn = new Button(3,250,160,360,240,3,0,false,0,0,0,"../img/selections.png");
var xBtn = new Button(4,10,10,30,30,4,0,false,0,0,0,"../img/xButton.png");
var shopTab0 = new Button(5,100,510,100,50,0,0,false,0,0,0,"../img/ShopTab.png");
var shopTab1 = new Button(6,100,510,100,50,0,1,false,0,0,0,"../img/ShopTab.png");
var shopTab2 = new Button(7,100,510,100,50,0,2,false,0,0,0,"../img/ShopTab.png");
var farmTab0 = new Button(8,0,510,100,50,0,0,false,0,0,0,"../img/FarmTab.png");
var farmTab1 = new Button(9,0,510,100,50,0,1,false,0,0,0,"../img/FarmTab.png");
var farmTab2 = new Button(10,0,510,100,50,0,2,false,0,0,0,"../img/FarmTab.png");
var mapTab0 = new Button(11,200,510,100,50,0,0,false,0,0,0,"../img/MapTab.png");
var mapTab1 = new Button(12,200,510,100,50,0,1,false,0,0,0,"../img/MapTab.png");
var mapTab2 = new Button(13,200,510,100,50,0,2,false,0,0,0,"../img/MapTab.png");
var sellBtn = new Button(14,490,30,60,30,0,0,false,0,0,0,"../img/sell.png");
var buyBtn = new Button(15,490,60,60,30,0,0,false,0,0,0,"../img/buy.png");
var eatBtn = new Button(16,490,90,60,30,0,0,false,0,0,0,"../img/eat.png");
var plantBtnSt = buttonRender.length; //for updating text on the plant buttons
var potatoBtn = new Button(17,selposX,selposY[0],60,30,0,0,true,potato.seed+"             "+potato.plant,selposX-15,selposY[0]+20,"../img/potatoButton.png");
var tomatoBtn = new Button(18,selposX,selposY[1],60,30,0,0,true,tomato.seed+"             "+tomato.plant,selposX-15,selposY[1]+20,"../img/tomatoButton.png");
var carrotBtn = new Button(19,selposX,selposY[2],60,30,0,0,true,carrot.seed+"             "+carrot.plant,selposX-15,selposY[2]+20,"../img/carrotButton.png");

//============================================
//--------------------------------------------
//===========================================================================================
//SIDESCROLLER VARIABLES
stageHeight = 200;
class Enemy{
	constructor(img,atkImg,health,attack,aDelay,aW,aH,proj){
		this.Sprite = new Image();
		this.Sprite.src = img; //enemy image
		this.Attack = new Image();
		this.Attack.src = atkImg;
		this.health = health; //enemy health
		this.attack = attack; //enemy damage value
		this.x = 0; //enemy's position, to be implemented upon spawning
		this.y = 0;

		this.deltaMove = 0;// distance moved
		this.mAtkL = false;// whether or not it should melee attack left
		this.mAtkR = false;// whether or not it should melee attack right

		this.speed = 1; //enemy's movement speed
		this.aDelay = aDelay; //the max value for the timer that decides when an enemy attacks
		this.aTimer = 0; //the timer for that max value
		this.aW = aW; //the width of the attack
		this.aH = aH; //the height of the attack
		this.proj = proj; //bool stating whether the enemy uses a projectile attack
		if (this.proj = true){ //if the enemy does use a projectile then this dictates the speed that travels at
			this.projSp = 2;
		}
		this.isHit = false;
	}

}
function Player(x,y,w,h,health,dmg,hspeed,vspeed,jspeed,img,aImg,sImg){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.jump = false;
	this.attack = false;
	this.grav = 10;
	this.floorY = y;
	this.jspeed = jspeed;
	this.jtop = false;
	this.health = health;
	this.dmg = dmg + stats[1]; // increases damage (int)
	this.blockRt = 0 + stats[2]; // increases block (cha)
	this.hspeed = hspeed + stats[0]; // increases horizontal speed (dex)
	this.vspeed = vspeed; //increasese vertical speed (dex)
	this.sprite = new Image();
	this.sprite.src = img;
	this.shadow = new Image();
	this.shadow.src = sImg;
	this.aSprite = new Image();
	this.aSprite.src = aImg;
	this.hitboxX = 0;
	this.hitboxY = 0;
	this.hitboxC = 0;
	this.hitboxR = false;
	this.isHit = false;
	this.hitTime = 0;
}
var renderer = canvas.getContext("2d");
var shotimg;//var for projectile img
var soldierA = [];//array to hold the values of mArray that are soldiers
var rAtk = [];// holds the values of each bullet
var sdcPlayer = new Player(430,230,64,64,10,1,5,2.5,20,"../img/Ship.png","../img/Bullet.png","../img/Shadow.png");
var leftMove = rightMove = backMove = forMove = false;
var playerimg;
var attackimg;
var fakeX = 0;
var jumpInt = 0;
//Enemy Spawn
var sAcount = 0; //this variable controls which wave we're on
var sACmax = 4; //this is the max number of waves
var sArray = [[1,2,1,2,1,2,3], //this is the wave list, 1 = archer, 2 = soldier, 3 says to stop instantiating
			  [2,1,3,0,0,0,0],
			  [2,2,3,0,0,0,0],
			  [1,1,1,3,0,0,0],
			  [2,2,1,1,3,0,0]];
var mArray = [];
var spawnMax = 6;
var waveT = 0; //time between waves
var waveTM = 10; //max time between waves
var waveTB = true; //bool stating when a wave is over
soldier = new Enemy ("../img/soldier.png","../img/Bullet.png",10,2,2,20,70,false);//creates a new soldier
archer = new Enemy ("../img/archer.png","../img/Bullet.png",5,4,5,50,10,true);//creates a new archer
//===========================================================================================
//PLATFORMER VARIABLES
var wall = new Image();
wall.src = "../img/temple_wall.png";
var faceRight = true;
var playerSprite = 0;
var maxSprites = 4;
var spriteCtr = 0;
var framesPerSprite = 6;
var map_vx = 0;
var onGround = false;
var pltPlayer = new PlatPlayer("../img/CharAnimRS.png", 16,300,64,64,0,0); // creating a player object for platformer
var MoneyBg; // Object for Moneybag
var SeedBg = new Object("../img/Seedbag.png"); // Object for Seedbag
var Spike; // Object for Spike
var SpikeL = new Object ("../img/SpikeL.png", 0,0,50,50,0,0); //Object for Leftward Spike
var map = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,0,0],
	[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,2,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
	[1,1,1,1,1,1,4,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
	
];
var ground = [];



pltPlayer.V_Y = 3;

// Set object for player and enemy
function PlatPlayer(img,x,y,w,h,vx,vy){
	this.Sprite = new Image();
	this.Sprite.src = img;
	this.X = x; // object x position
	this.Y = y; // object y position 
	this.W = w; // object width	
	this.H = h; // object height
	this.V_X = vx; // object horizontal velocity 
	this.V_Y = vy; // object vertical velocity 
	this.leftPressed = false;  
	this.rightPressed = false;
	this.upPressed = false;
	this.Previous_X;
	this.Previous_Y;
	this.SIZE = 64;
	this.gav = 0;
	this.weight = 0.5;
	this.collision = function(obj){
		if (this.X + 25 > obj.X + obj.W) return false;
		if (this.X + this.W < obj.X) return false;
		if (this.Y > obj.Y + obj.Y) return false;
		if (this.Y + this.H < obj.Y) return false;
		onGround = true
		return true;
	}
}
function Object(img,x,y,w,h){
	this.Sprite = new Image();
	this.Sprite.src = img;
	this.X = x;
	this.Y = y;
	this.W = w;
	this.H = h;
}
function Block(img,x,y,w,h){
	this.Sprite = new Image();
	this.Sprite.src = img;
	this.X = x;
	this.Y = y;
	this.W = w;
	this.H = h;
} 

//===========================================================================================

startFunc();
//INITIALIZATION
function startFunc(){
	//INCREMENTAL INITIALIZATION
	selRender = new Image;
	baseImg = new Image;
	selRender.src = "../img/Border.png";
	baseImg.src = "../img/Soil.png";
		for (i = 0; i < 4; i++){ //this stuff populates the farm/field player can grow shit on
		farmPlot[i] = [];
		for (j = 0; j < 4; j++){
			var square = {};
			square.x = i*64+10; //x coord
			square.y = j*64+10; //y coord
			square.xw = square.x+64; //bottom corner x coord
			square.yh = square.y+64; //bottom corner y coord
			square.img = baseImg; //image to render
			square.seed = plantNull; //type of plant growing (null by default) 
			square.growing = false; //is a plant growing?
			square.harvest = false; //is a plant harvestable?
			square.tick = 0; //timer for plant growth
			square.grow = 0; //state of plant growth
			farmPlot[i][j] = square;
		}
	}
	//=======================================================================================
	//SIDESCROLLER
	//=======================================================================================
	// Platformer
	for ( var i = 0; i < map.length; i++){
		ground[i] = [];
		for (var j = 0; j < map[i].length; j++){
			if(map[i][j] == 0){
				ground[i][j] = null;
			}else if (map[i][j] == 1){
				console.log("x "+i+" y "+j);
				ground[i][j] = new Block("../img/temple_ground.png",j*64,i*64,64,64); // creating the platform
			}else if (map[i][j] == 2){
				ground[i][j] = new Block("../img/Moneybag.png", j*64,i*64,64,64);
				MoneyBg = ground[i][j];
			}else if (map[i][j] == 3){
				
			}else if (map[i][j] == 4){
				ground[i][j] = new Block ("../img/Spike.png", j*64,i*64,64,64);
				Spike = ground[i][j];
			}
		}
	}
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
			if (waveTB == true){ //waveT is the pause between waves, waveTB will be true when the last enemy is killed (not implemented yet) starting the next wave's spawn
				waveT += 1;
				if (waveT >= waveTM){
					waveTB = false;
					spawn();
				}
			}
			enemyAttack();//updates the bullets
			enemyMove();//moves the soldiers
			break;
		case 2: //platformer
			movement();
			movePlayer();
			break;
		case 3: //map

			break;
	}
	render();
}
function clickCheck(x,y,btnType){ //check if something is clicked
	if (!(y > btnType.yh || //is the mouse inside the y axis?
		  y < btnType.y||
		  x > btnType.xw || //is the mouse inside the x axis?
		  x < btnType.x)){
		return true; //yes it is
	}
	return false; //no it's not
}
function onKeyDown(e){
	switch(e.keyCode){
		case 65:
			pltPlayer.leftPressed = true;
			leftMove = true
			break;
		case 68:
			pltPlayer.rightPressed = true;
			rightMove = true
			break;
		case 87:
			pltPlayer.upPressed = true;
			backMove = true;
			break;
		case 83: //s moves forward
			forMove = true;
			break;
		case 32: //jump
			if(sdcPlayer.jump == false){
				sdcPlayer.floorY = sdcPlayer.y;
				sdcPlayer.jump = true;
			}
			break;
		case 74: //j attack
			if (sdcPlayer.attack == false){
				sdcPlayer.attack = true;
				sdcPlayer.hitboxR = true;
			}
			break;
	}
}

function onKeyUp(e){
	switch(e.keyCode){
		case 65:
			pltPlayer.leftPressed = false;
			leftMove = false;
			break;
		case 68:
			pltPlayer.rightPressed = false;
			rightMove = false;
			break;
		case 87:
			pltPlayer.upPressed = false;
			backMove = false;
			break;
		case 83: //s moves forward
			forMove = false;
			break;
	}
}
function onClick(e){
	var xClick = e.pageX - canvas.offsetLeft;
	var yClick = e.pageY - canvas.offsetTop;
	switch (cG){
		case 0:
		//menu selection
			if (clickCheck(xClick,yClick,farmTab0) == true){ //click farm tab
				tab = 0;
				stage.style.backgroundColor = "#202316";
			}
			else if (clickCheck(xClick,yClick,shopTab0) == true){//click shop tab
				tab = 1;
				stage.style.backgroundColor = "white";
			}
			else if (clickCheck(xClick,yClick,mapTab0) == true){//click map tab
				tab = 2;
				stage.style.backgroundColor = "yellow";
			}
		switch (tab){
			case 0:
				if (clickCheck(xClick,yClick,mapBtn) == true) //did the player click on the map?
				{
					 cG = 3;
					 tab = 0;
				}
				if (clickCheck(xClick,yClick,farmSize) == true){ //did the player click on the farm?
					for ( i = 0; i < 4; i++){
						for (j = 0; j < 4; j++){
							if (clickCheck(xClick,yClick,farmPlot[i][j]) == true){ //check to see which square they clicked on
								if (farmPlot[i][j].growing == false && farmPlot[i][j].harvest == false && selected != plantNull && plantHolder[selected].seed > 0){ // checks if the square is empty and tells that square to grow
									farmPlot[i][j].seed = selected;
									farmPlot[i][j].growing = true;
									farmPlot[i][j].img = plantHolder[selected].img[0];
									plantHolder[selected].seed -= 1; // removes the selected seed type from player inventory
									textUpdate(buttonRender[selected+plantBtnSt],plantHolder[selected].seed+"             "+plantHolder[selected].plant); //updates the text on the respective button
									planting.play();
								}
								if (farmPlot[i][j].harvest == true){ //checks if the square is harvestable, takes the plant into the inventory and returns to it's start state

									if (Math.random()*100 < seedChance){
										plantHolder[farmPlot[i][j].seed].seed += 1;
										bonus.play();
									}/* has a chance to gain an extra seed of the type harvested*/

									if (Math.random()*100 < extraChance){
										plantHolder[farmPlot[i][j].seed].plant += 1;
										bonus.play();
									}/*chance to gain a second plant of the type harvested*/

									plantHolder[farmPlot[i][j].seed].plant += 1;
									textUpdate(buttonRender[farmPlot[i][j].seed+plantBtnSt],plantHolder[farmPlot[i][j].seed].seed+"             "+plantHolder[farmPlot[i][j].seed].plant); //updates the text on the respective button
									farmPlot[i][j].harvest = false;
									farmPlot[i][j].seed = plantNull;
									farmPlot[i][j].img = baseImg;
									farmPlot[i][j].grow = 0;
									harvest.play();
								}
							}
						}
					}
				}
				if(clickCheck(xClick,yClick,buyBtn) == true){ // check if they clicked the buy button
					if (selected != plantNull && gold > 0){ // if they have a plant selected, and enough gold to buy a plant, buy it
						plantHolder[selected].seed++;
						gold -= 25 - Math.floor(stats[2]/2);/*incorporated chr to decrease purchase value by 1 per 2 chr*/
					}
				}
				if (clickCheck(xClick,yClick,sellBtn) == true){ // check if they clicked the sell button
					if (selected != plantNull && plantHolder[selected].plant > 0){ // if they have a plant selected and have a plant to sell, sell it
						plantHolder[selected].plant -= 1;
						gold += 50  + goldBonus;/*incorporated chr to increase sell value by 10 for each chr point*/
					}
				}
				if (clickCheck(xClick,yClick,eatBtn) == true){ // check if they clicked the eat button
					if (selected != plantNull && plantHolder[selected].plant > 0){ // if they have a plant selected, and a plant to eat, eat it
						plantHolder[selected].plant -= 1;
						stats[selected] += 1;
					}
				}
				if (clickCheck(xClick,yClick,potatoBtn) == true){ //check if they clicked the potato button and select potatoes if so
					selected = 0;
					selX = selposX;
					selY = selposY[selected]; // all three of these also move the highlight image around the button
				}
				if (clickCheck(xClick,yClick,tomatoBtn) == true){ //check if they clicked the tomato button and select tomatoes if so
					selected = 1;
					selX = selposX;
					selY = selposY[selected];
				}
				if (clickCheck(xClick,yClick,carrotBtn) == true){ //check if they clicked the carrot button and select carrots if so
					selected = 2;
					selX = selposX;
					selY = selposY[selected];
				}
				break;
			case 1://IN SHOP //shopitems = 50 shopy[6] = 350
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
						selected = plantNull;
					} //dex int cha tabs
				}
				break;
			case 2://IN MAP
				break;
		}
			break;
		case 1: //sidescroller
            if (clickCheck(xClick,yClick,backBtnSdc) == true){//back to incremental level
			    cG = 0;
				tab = 0;
			}
			break;
		case 2: //platformer
		    if (clickCheck(xClick,yClick,backBtnPlt) == true){//back to incremental level
			    cG = 0;
				tab = 0;
			}
			break;
		case 3: //map
			if (xClick > mapSelBtn.x && xClick < mapSelBtn.x+mapSelBtn.w && yClick > mapSelBtn.y && yClick < mapSelBtn.y+(mapSelBtn.h/3)){ //platformer transition
				cG = 2;
				tab = 0;
			}
			if (xClick > mapSelBtn.x && xClick < mapSelBtn.x+mapSelBtn.w && yClick > mapSelBtn.y+(mapSelBtn.h/3) && yClick < mapSelBtn.y+(2*(mapSelBtn.h/3))){ //platformer transition
				cG = 1;
				tab = 0;
			}
			if (xClick > mapSelBtn.x && xClick < mapSelBtn.x+mapSelBtn.w && yClick >mapSelBtn.y+(2*(mapSelBtn.h/3)) && yClick < mapSelBtn.y+mapSelBtn.h){ //platformer transition
				cG = 0;
				tab = 0;
			}
			break;
	}
}
//===========================================================================================
//INCREMENTAL CODE BLOCK
function growUp(plot){
	plot.tick++;
	if (plot.tick == plantHolder[plot.seed].gt){
		plot.grow++;
		plot.img = plantHolder[plot.seed].img[plot.grow];
		plot.tick = 0;
		if (plot.grow == 3){
			plot.harvest = true;
			plot.growing = false;
		}
	}
}

//===========================================================================================
//SIDESCROLLER CODE BLOCK
function playerMove(){ //basic movement stuff, just like in the platformer
	if (leftMove == true && sdcPlayer.x > 0){
		sdcPlayer.x -= sdcPlayer.hspeed;
	}if (rightMove == true && sdcPlayer.x + sdcPlayer.w < canvas.width){
		sdcPlayer.x += sdcPlayer.hspeed;
	}if (backMove == true && sdcPlayer.floorY > stageHeight){
		sdcPlayer.floorY -= sdcPlayer.vspeed;
		sdcPlayer.y -= sdcPlayer.vspeed;
	}if (forMove == true && sdcPlayer.y + sdcPlayer.h < canvas.height){
		sdcPlayer.floorY += sdcPlayer.vspeed;
		sdcPlayer.y += sdcPlayer.vspeed;
	}
}
function jump(){ //this is some awful jump code that makes the player spin in a fucking parabola
	sdcPlayer.y -= sdcPlayer.jspeed - sdcPlayer.grav;
	switch (sdcPlayer.jtop){
		case false:
			sdcPlayer.jspeed = 20;
			if (sdcPlayer.y < sdcPlayer.floorY - 100){
				sdcPlayer.jtop = true;
			}
			break;
		case true:
			sdcPlayer.jspeed = 0;
			if (sdcPlayer.y >= sdcPlayer.floorY){
				sdcPlayer.jtop = false;
				sdcPlayer.jump = false;
			}
			break;
	}
}
function attack(){ //this spawns the player's attack
	console.log (sdcPlayer.hitboxR);
	sdcPlayer.hitboxC ++;
	sdcPlayer.hitboxX = sdcPlayer.x+sdcPlayer.w;
	sdcPlayer.hitboxY = sdcPlayer.y+(sdcPlayer.h/4);
	if (sdcPlayer.hitboxR == true){
		for (i=0; i < mArray.length; i++){ //this is checking collision with enemies and damaging them
			if (!(sdcPlayer.hitboxY > mArray[i].y+64 ||
				  sdcPlayer.hitboxY+32 < mArray[i].y ||
				  sdcPlayer.hitboxX > mArray[i].x+48 ||
				  sdcPlayer.hitboxX+32 < mArray[i].x)){
				if (mArray[i].isHit == false){
					mArray[i].health -= sdcPlayer.dmg;
					mArray[i].isHit = true; //is hit stops the enemy from taking damage on every frame of player attack, they only take damage once
				}
			}
		}
	}
	else{ //once the player attack is done, all enemies are rendered hitable again.
		for (i=0; i <mArray.length; i++){
			if (mArray[i].isHit == true){
				mArray[i].isHit = false;
			}
		}
	}
	if (sdcPlayer.hitboxC == 10){ //this stuff is timers for when the player can and can't attack
		sdcPlayer.hitboxR = false;
	}
	if (sdcPlayer.hitboxC >= 25){
		sdcPlayer.attack = false;
		sdcPlayer.hitboxC = 0;
	}
}
function spawn(){ //spawns enemies
	for (i = 0; i < spawnMax; i++){ //spawnMax is the max number of enemies we can spawn, currently it's 7
		switch (sArray[sAcount][i]){ //this checks the array storing our planned enemy compositions, sAcount stores the current difficulty/spawn wave, i is the enemy we're spawning
			case 1:
				archer = new Enemy ("../img/archer.png","../img/Bullet.png",5,4,5,50,10,true);//creates a new archer
				mArray[i] = archer;
				mArray[i].x = 500;
				mArray[i].y = i*70+200;
				if(i == rAtk.length)
				{
					rAtk[i] = {x: mArray[i].x, y: mArray[i].y, sX:mArray[i].x, sY: mArray[i].y, bullDist: 0};//creates a new bullet

				}//if the current index of mArray is the same as the length of the rAtk array create a new bullet at that index
				else if(i > rAtk.length)
				{
					rAtk[rAtk.length] = {x: mArray[i].x, y: mArray[i].y,sX:mArray[i].x, sY: mArray[i].y, bullDist: 0};//creates a new bullet
				}//if the current index of mArray is the same as the length of the rAtk array create a new bullet at the last index of rAtk
				console.log ("archer");
				break;
			case 2:
				soldier = new Enemy ("../img/soldier.png","../img/Bullet.png",10,2,2,20,70,false);//creates a new soldier
				mArray[i] = soldier;
				mArray[i].x = 500;
				mArray[i].y = i*70+200;
				if(i == soldierA.length)
				{
					soldierA[i] = i;
				}//if the current index of mArray is the same as the length of the soldierA create add the current index of mArray to the same index of soldierA
				else if(i > soldierA.length)
				{
					soldierA[soldierA.length] = i;
				}//if current index of mArray is larger than the length of soldierA add the current index of mArray at the last index of soldierA
				console.log ("soldier");
				break;
			case 3: //when the array has a 3 in it the for loop stops checking and the spawning stops
				i = spawnMax;
				console.log ("end");
				break;
		}
	}
	sAcount++; //this ticks up the difficulty/ spawn wave for the next wave, when it hits the max currently it just spawns the same wave over and over
	if (sAcount >= sACmax){
		sAcount -= 1;
	}


}
function enemyAttack()
{
	for (i = 0; i < rAtk.length; i++)
	{
		rAtk[i].x -= archer.projSp;
		rAtk[i].bullDist += 1;
		if(rAtk[i].bullDist >= 150)
		{
			rAtk[i].x = rAtk[i].sX;
			rAtk[i].bullDist = 0;
		}
		if (sdcPlayer.isHit == false){
			if (!(rAtk[i].y > sdcPlayer.y+64 ||
					  rAtk[i].y+32 < sdcPlayer.y ||
					  rAtk[i].x > sdcPlayer.x+48 ||
					  rAtk[i].x+32 < sdcPlayer.x)){
				if (sdcPlayer.isHit == false){
					sdcPlayer.isHit = true;
					sdcPlayer.health -= mArray[i].attack;
				}
			}
		}
	}//updates each bullet
	if (sdcPlayer.isHit == false){
		for (i = 0; i < mArray.length; i++){
			if (mArray[i].proj == true){	
			}
			if (mArray[i].proj == false){
					if (!(mArray[i].y > sdcPlayer.y+64 ||
					  mArray[i].y+32 < sdcPlayer.y ||
					  mArray[i].x > sdcPlayer.x+48 ||
					  mArray[i].x+32 < sdcPlayer.x)){
						if (sdcPlayer.isHit == false){
						  sdcPlayer.isHit = true;
						  sdcPlayer.health -= mArray[i].attack;
						}
					  }
			}//butts
		}
	}
	else {
		sdcPlayer.hitTime += 1;
		if (sdcPlayer.hitTime > 40){
			sdcPlayer.hitTime = 0;
			sdcPlayer.isHit = false;
		}
	}
}
function enemyMove()
{
	for(i = 0; i < soldierA.length; i++)
	{
			if(mArray[soldierA[i]].deltaMove < 100)
			{
				if(mArray[soldierA[i]].deltaMove == 10)
				{
					mArray[soldierA[i]].mAtkR = false;
				}//stops the attack on right side
				mArray[soldierA[i]].x -= soldier.speed;
				mArray[soldierA[i]].deltaMove += soldier.speed;
			}//moves the soldier left
			else if(mArray[soldierA[i]].deltaMove == 100)
			{
				mArray[soldierA[i]].mAtkL = true;
				mArray[soldierA[i]].deltaMove += soldier.speed;
				mArray[soldierA[i]].x += soldier.speed;
			}//makes an attack on the leftside
			else if(mArray[soldierA[i]].deltaMove == 200)
			{
				mArray[soldierA[i]].mAtkR = true;
				mArray[soldierA[i]].deltaMove = 0;
			}//makes an attack on the rightside
			else if(mArray[soldierA[i]].deltaMove > 100)
			{
				if(mArray[soldierA[i]].deltaMove == 110)
				{
					mArray[soldierA[i]].mAtkL = false;
				}//stops the attack on the leftside
				mArray[soldierA[i]].x += soldier.speed;
				mArray[soldierA[i]].deltaMove += soldier.speed;
			}//moves the soldier right
	}//loops through all soldier indexs stored in soldierA within mArray
}//function for enemy movement.
//===========================================================================================
//PLATFORMER CODE BLOCK
function movement()
{
	pltPlayer.gav = 10;
	
	for( var i = 0; i < map.length; i++){
		for( var j = 0; j < map[i].length; j++){
			if(map[i][j] == 1 || map[i][j] == 2 || map[i][j] == 4)
				ground[i][j].X += -map_vx;
		}
	}
	pltPlayer.X += pltPlayer.V_X;
	pltPlayer.Y += pltPlayer.V_Y;
	if (pltPlayer.V_Y < pltPlayer.gav)
		pltPlayer.V_Y += pltPlayer.weight;
	for ( var i = 0; i < map.length; i++){
		for (var j = 0; j < map[i].length; j++){
			if (map[i][j] == 1){
				if (pltPlayer.collision(ground[i][j]) && pltPlayer.Y + pltPlayer.H < ground[i][j].Y + pltPlayer.V_Y){
					pltPlayer.Y = ground[i][j].Y - pltPlayer.H;
					pltPlayer.V_Y = 0;
				}
			}
		}
	}
	animatePlayer();
	//checkCollision();	
	pltResult();
}
function pltResult()
{	
    if (Spike.Y == pltPlayer.Y + pltPlayer.H|| Spike.Y <= pltPlayer.Y + pltPlayer.H )
	{
		pltPlayer.leftPressed = pltPlayer.rightPressed = pltPlayer.upPressed = false;
		pltPlayer.Y = Spike.Y + Spike.H - pltPlayer.Y;
		console.log("Failed");
		window.alert("You got wounded and lost some gold!")
		gold = gold - 50;
		cG = 0;
		pltRespawn();
	}
	if (pltPlayer.X == MoneyBg.X + 30 - pltPlayer.W && pltPlayer.Y >= MoneyBg.Y - pltPlayer.H + 30)
	{
		pltPlayer.leftPressed = pltPlayer.rightPressed = pltPlayer.upPressed = false;
		console.log("Win");
		window.alert("You found some Gold!");
		gold += 100;
		cG = 0;
		pltRespawn();
	}
}
function pltRespawn()
{
	pltPlayer.X = 16;
	pltPlayer.Y = 300;
	pltPlayer.V_X = 0;
}
/*function checkCollision()
{
	
	for ( var i = 0; i < map.length; i++){
		for (var j = 0; j < map[i].length; j++){
			if (map[i][j] == 1){
				if(pltPlayer.X + pltPlayer.W > ground[i][j].X)  pltPlayer.X = ground[i][j].X - pltPlayer.W;
				if(pltPlayer.X + 25 < ground[i][j].X + ground[i][j].W) pltPlayer.X = ground[i][j].X + ground[i][j].W -25;
				//if(pltPlayer.Y > ground[i][j].Y + ground[i][j].H) pltPlayer.Y += pltPlayer.V_Y;
			}
		}
	}
}*/
function animatePlayer()
{
	spriteCtr++;
	if(spriteCtr == framesPerSprite)
	{
		spriteCtr = 0;
		playerSprite++;
		if(playerSprite == maxSprites)
			playerSprite = 0;
	}
}
function movePlayer()
{
	if(pltPlayer.leftPressed){
		faceRight = false;
		map_vx = -8;
		pltPlayer.V_X = -5;
		pltPlayer.Sprite.src = "../img/CharAnimL.png";
	}
	if(pltPlayer.rightPressed){
		faceRight = true;
		map_vx = 8;
		pltPlayer.V_X = 5;
		pltPlayer.Sprite.src = "../img/CharAnimR.png";
	}
	if(!pltPlayer.leftPressed && !pltPlayer.rightPressed){
		pltPlayer.V_X = 0;
		map_vx = 0;
		if(faceRight)
			pltPlayer.Sprite.src = "../img/CharAnimRS.png";
		else 
			pltPlayer.Sprite.src = "../img/CharAnimLS.png";
	}
	if (pltPlayer.upPressed && onGround){
		pltPlayer.V_Y = -9;
		//console.log(pltPlayer.X);
		//console.log(pltPlayer.Y);
		onGround = false;
	}

}
//===========================================================================================
//RENDER
function render(){
	renderer.clearRect(0,0,canvas.width,canvas.height);
	for (i = 0; i < buttonRender.length; i++){ //checks and renders every button
		if (buttonRender[i].cG == cG){ //is the button in this gamestate?
			if (buttonRender[i].tab == tab){ //is the button in this tab?
				renderer.drawImage(buttonRender[i].img,buttonRender[i].x,buttonRender[i].y); //draw the button
				if (buttonRender[i].textBool == true){ //does the button have text to render?
					renderer.fillText(buttonRender[i].text,buttonRender[i].tX,buttonRender[i].tY); //render the text
				}
			}
		}
	}
	switch (cG){
		case 0:
			renderer.drawImage(selRender,selX,selY);
			for (i = 0; i < 3; i++){ //renders stats on screen
				renderer.fillText(statName[i],selposX,selposY[i]+200);
				renderer.fillText(stats[i],selposX+50,selposY[i]+200);
			}
			renderer.fillText("Gold: ",selposX,selposY[2]+240);
			renderer.fillText(gold, selposX+50,selposY[2]+240);
			for (i = 0; i < 4; i++){ //draws the farm plots
				for (j = 0; j < 4; j++){
					renderer.drawImage(farmPlot[i][j].img,farmPlot[i][j].x,farmPlot[i][j].y);
				}
			}
			/*
			if (tab == 1){
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
			if (tab == 2) {
				renderer.clearRect(0,0,canvas.width,canvas.height);
				renderer.drawImage(farmTab,0,510); //tabs sized 100,50
				renderer.drawImage(shopTab,100,510);
				renderer.drawImage(mapTab,200,510); //all tabs
			}
			*/
			break;
		case 1:
			renderer.drawImage(sdcPlayer.shadow,sdcPlayer.x,sdcPlayer.floorY+20);
			renderer.drawImage(sdcPlayer.sprite,sdcPlayer.x,sdcPlayer.y);
			for (i = 0; i < mArray.length; i++)
			{
				renderer.drawImage(mArray[i].Sprite, mArray[i].x, mArray[i].y);//draws each enemy

				if(mArray[i].proj == true)
				{
					if(i < rAtk.length)
					{
						renderer.drawImage(mArray[i].Attack, rAtk[i].x, rAtk[i].y);//draws each bullet for the archers
					}//not quite sure why but fixed an error so not going to question it

				}
				if(mArray[i].mAtkL == true)
				{
					renderer.drawImage(mArray[i].Attack, mArray[i].x - (2 * mArray[i].aW), mArray[i].y);
				}//makes a melee attack on the left side
				if(mArray[i].mAtkR == true)
				{
					renderer.drawImage(mArray[i].Attack, mArray[i].x + (3.5 * mArray[i].aW), mArray[i].y);
				}// makes a melee attack on the right side
				renderer.fillText (mArray[i].health,mArray[i].x,mArray[i].y);
			}
			if (sdcPlayer.hitboxR == true){
				renderer.drawImage(sdcPlayer.aSprite,sdcPlayer.hitboxX,sdcPlayer.hitboxY);
			}
			renderer.fillText(sdcPlayer.health,840,20);
			break;
		case 2:
			renderer.drawImage(wall, 0, 0);
			renderer.drawImage(pltPlayer.Sprite,
							   pltPlayer.SIZE*playerSprite, 0, pltPlayer.SIZE, 64,
							   pltPlayer.X, pltPlayer.Y, pltPlayer.SIZE, pltPlayer.SIZE);
			for ( var i = 0; i < map.length; i++){
				for (var j = 0; j < map[i].length; j++){
					if (map[i][j] == 1)
						renderer.drawImage(ground[i][j].Sprite,ground[i][j].X, ground[i][j].Y);	
					else if (map[i][j] == 2)
						renderer.drawImage(MoneyBg.Sprite, MoneyBg.X, MoneyBg.Y);
					else if (map[i][j] == 3){}
					else if (map[i][j] == 4)
						renderer.drawImage(Spike.Sprite, Spike.X, Spike.Y);
					
				}
			}
			break;
	}
}