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
var seedChance = 10;
var extraChance = 0;
var goldBonus = 0;
var diminish = 0.4;
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
var selected = 0; //which plant is selected
var tab = 0; //tracks the current tab of the player
var cG = 0;
//bunch of shop code i dunno what the fuck to do with
var shopY = [50,100,150,200,250,300,350,400];
var storeT;
var storeStrings = ["Potato Seed","Tomato Seed","Carrot Seed","Potato Plant","Tomato Plant","Carrot Plant"];
var storeSeed = 0;
var arrow = 0; //list index for plants
var arrow2 = 0; //list index for plants in shop
var dexPlants = 0; //counting dex plants
var intPlants = 0; //counting int plants
var chaPlants = 0; //counting cha plants
var statSel = plantNull; //selecting stat tabs
//--------------------------------------------
//plant function and plant related variables
var plantHolder = []; //array for calling plants by id
function Plant(name,gt,id,img,stat,price,sell,seed,plant,boost){
	this.name = name; //kevin added names
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
	this.plant = plant; //number of full grown plants of this plant type
	this.boost = boost;
	plantHolder[id] = this; //id for calling each plant type by #
}
//PLANT TYPE INSTANTIATION
 //growtime, plantid, final growth source, stat affected (by #id), buy price, sell price, number of seeds
var potato = new Plant("Potato",40,0,"../img/potato.png",0,5,25,5,0,1);
var tomato = new Plant("Tomato",40,1,"../img/tomato.png",1,5,25,5,0,1);
var carrot = new Plant("Carrot",40,2,"../img/carrot.png",2,5,25,5,0,1); //all plants have names now in the class
var p2 = new Plant("Test1",40,3,"../img/potato.png",0,5,25,5,0,1);
var t2 = new Plant("Test2",40,4,"../img/tomato.png",1,5,25,5,0,1);
var c2 = new Plant("Test3",40,5,"../img/carrot.png",2,5,25,5,0,1); //plants for testing

var plantNull = plantHolder.length + 1; //variable for selected to store a nonexsistant plant (for when player selects nothing)
//============================================
//--------------------------------------------
//button function and button related variables
var buttonRender = []; //array for calling buttons by id
class Button{
	constructor (id,x,y,w,h,cG,tab,tB,text,textX,textY,img){
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
var sellBtn0 = new Button(14,490,30,60,30,0,0,false,0,0,0,"../img/sell.png");
var sellBtn1 = new Button(15,120,340,60,30,0,1,false,0,0,0,"../img/sell.png"); //sell button for shop
var sellBtnBord = new Button(16,120,340,60,30,0,1,false,0,0,0,"../img/Border.png"); //border for button
var buyBtn0 = new Button(17,490,60,60,30,0,0,false,0,0,0,"../img/buy.png");
var buyBtn1 = new Button(18,50,340,60,30,0,1,false,0,0,0,"../img/buy.png"); //buy button for shop
var buyBtnBord = new Button(19,50,340,60,30,0,1,false,0,0,0,"../img/Border.png"); //border
var eatBtn0 = new Button(20,490,90,60,30,0,0,false,0,0,0,"../img/eat.png");
var eatBtn1 = new Button(21,190,340,60,30,0,1,false,0,0,0,"../img/eat.png"); //eat button for shop
var eatBtnBord = new Button(22,190,340,60,30,0,1,false,0,0,0,"../img/Border.png"); //border
var dexTab = new Button(23,50,100,64,40,0,1,false,0,0,0,"../img/DexTab.png");
var intTab = new Button(24,120,100,64,40,0,1,false,0,0,0,"../img/intTab.png");
var chaTab = new Button(25,190,100,64,40,0,1,false,0,0,0,"../img/ChaTab.png"); //stat tab buttons
var leftArrow2 = new Button(26,75,222,40,40,0,1,false,0,0,0,"../img/LeftArrow.png")
var rightArrow2 = new Button(27,190,222,40,40,0,1,false,0,0,0,"../img/RightArrow.png") //arrows
var invTxt = new Button(28,0,0,64,64,0,1,true,"Inventory",550,50,""); //store texts
var plantBtnSt = buttonRender.length; //for updating text on the plant buttons

var potatoBtn = new Button(29,900,900,60,30,0,-1,true,potato.seed+"             "+potato.plant,selposX-15,selposY[0]+20,"../img/potatoButton.png");
var tomatoBtn = new Button(30,900,900,60,30,0,-1,true,tomato.seed+"             "+tomato.plant,selposX-15,selposY[1]+20,"../img/tomatoButton.png");
var carrotBtn = new Button(31,900,900,60,30,0,-1,true,carrot.seed+"             "+carrot.plant,selposX-15,selposY[2]+20,"../img/carrotButton.png");
var invPotato = new Button(32,900,900,64,64,0,1,true,"Potatoes: " +plantHolder[0].plant,550,80,"");
var invTomato = new Button(33,900,900,64,64,0,1,true,"Tomatoes: " +plantHolder[1].plant,550,110,"");
var invCarrot = new Button(34,900,900,64,64,0,1,true,"Carrots: " +plantHolder[2].plant,550,140,""); //plants in inventory
var plantSel2 = new Button(35,120,210,64,64,0,1,true,plantHolder[0].name,127,300,"../img/potato.png") //plant selection
var plantSel = new Button(36,490,175,64,64,0,0,true,plantHolder[0].name,490,260,"../img/potato.png") //plant selection
var leftArrow = new Button(37,445,187,40,40,0,0,false,0,0,0,"../img/LeftArrow.png")
var rightArrow = new Button(38,560,187,40,40,0,0,false,0,0,0,"../img/RightArrow.png") //arrows

function countPlants() {
	for (x = 0; x < plantHolder.length; x++){
		if (plantHolder[x].stat == 0){ //if the plant is dex, adds to dex counter
			dexPlants += 1;
		}
		else if (plantHolder[x].stat == 1){ //if plant is int, adds to int counter
			intPlants += 1;
		}
		else if (plantHolder[x].stat == 2) { //if plant is cha, adds to cha counter
			chaPlants += 1;
		}
	}
	console.log("dex: " + dexPlants);
	console.log("int: " + intPlants);
	console.log("cha: " + chaPlants); //just to check if i did it right
}

//============================================
//--------------------------------------------
//===========================================================================================
//SIDESCROLLER VARIABLES
stageHeight = 200;
class Enemy{
	constructor(name,img,aAImg,atkImg,health,attack,aDelay,aW,aH,proj){
		this.name = name;
		this.Sprite = new Image();
		this.Sprite.src = img; //enemy image
		this.Attack = new Image();
		this.Attack.src = atkImg;
		this.aASprite = new Image();
		this.aASprite.src = aAImg;
		this.bSprite = new Image();
		this.bSprite.src = img;
		this.health = health; //enemy health
		this.attack = attack; //enemy damage value
		this.x = 0; //enemy's position, to be implemented upon spawning
		this.y = 0;
		
		this.facing = "L";
		this.deltaMove = 0;// distance moved
		this.mAtk = false;// whether or not it should melee attack left
		this.rAtkX = 0;
		this.rAtkY = 0;
		this.bullDist =0;
		this.fCount = 0;//frame counter
		this.fNum = 1;
		this.deltaMove = 0;
		this.mAtkX = 0;
		this.mAtkY = 0;
		this.side;
		this.goldV = 50;
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
class Player{
	constructor(x,y,w,h,health,dmg,hspeed,vspeed,jspeed,img,aImg,sImg,aAImg,jImg){
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
		this.healthMax = health;
		this.dmg = dmg; // increases damage (int)
		this.vspeed = vspeed; //increasese vertical speed (dex)
		this.hspeed = hspeed; // increases horizontal speed (dex)
		this.sprite = new Image();
		this.sprite.src = img;
		this.shadow = new Image();
		this.shadow.src = sImg;
		this.aSprite = new Image();
		this.aSprite.src = aImg;
		this.aASprite = new Image();
		this.aASprite.src = aAImg;
		this.jSprite = new Image();
		this.jSprite.src = jImg;
		this.bSprite = new Image();
		this.bSprite.src = img;
		this.hitboxX = 0;
		this.hitboxY = 0;
		this.hitboxC = 0;
		this.hitboxR = false;
		this.isHit = false;
		this.hitTime = 0;
	}
}
var renderer = canvas.getContext("2d");
var shotimg;//var for projectile img
var sdcPlayer = new Player(430,230,212,230,10,1,5,2.5,20,"../img/Player_Sprite.png","../img/Attaack.png","../img/Shadow.png","../img/Attack_Sprite.png","../img/Jump_Sprite.png");
var leftMove = rightMove = backMove = forMove = false;
var playerimg;
var attackimg;
var fakeX = 0;
var jumpInt = 0;
//Enemy Spawn
var sAcount = 0; //this variable controls which wave we're on
var sACmax = 4; //this is the max number of waves
var sArray = [[2,3,0,0,0,0,0], //this is the wave list, 1 = archer, 2 = soldier, 3 says to stop instantiating
			  [2,1,3,0,0,0,0],
			  [2,2,3,0,0,0,0],
			  [1,1,1,3,0,0,0],
			  [2,2,1,1,3,0,0]];
var mArray = [];
var spawnMax = 6;
var waveT = 0; //time between waves
var waveTM = 10; //max time between waves
var waveTB = true; //bool stating when a wave is over
var backgroundSS = new Image;
backgroundSS.src = "../img/backgroundSS.png";
//===========================================================================================
//PLATFORMER VARIABLES
var jump = new Audio("../wav/Jump.wav"); //sound effect while platplayer jumping
var footStep = new Audio("../wav/Footsteps.wav"); //sound effect while platplayer walking
var hurt = new Audio("../wav/Hurt.wav");//sound effect when play fall
var pltBG = new Image();
pltBG.src = "../img/temple_wall.png";
var faceRight = true;
var playerSprite = 0;
var maxSprites = 4;
var spriteCtr = 0;
var framesPerSprite = 6;
var map_vx = 0;
var onGround = false;
var pltPlayer = new PlatPlayer("../img/CharAnimRS.png", 64,300,40,64,0,0); // creating a player object for platformer
var MoneyBg; // Object for Moneybag
var SeedBg = new Object("../img/Seedbag.png"); // Object for Seedbag
var Spike; // Object for Spike
//var SpikeL = new Object ("../img/SpikeL.png", 0,0,50,50,0,0); //Object for Leftward Spike
var map = [
	[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3],
	[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3],
	[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3],
	[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,3,3,3,3,0,0,3],
	[3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,3],
	[3,0,0,0,0,0,0,0,0,0,3,0,0,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
	[3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3],
	[3,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,3],
	[3,1,1,1,1,1,1,4,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,3],
	
];
var map2 = [
	[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0],
	[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0],
	[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,3,0,0],
	[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,3,3,3,3,0,0],
	[3,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0],
	[3,0,0,0,0,0,0,0,0,0,3,3,0,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[3,0,0,0,0,0,3,3,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,4,0,0,0,0,0,0,0],
	[3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
	[3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
]
var ground = [];
var currentX;


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
function Block(img,x,y,w,h,type){
	this.Sprite = new Image();
	this.Sprite.src = img;
	this.X = x;
	this.Y = y;
	this.W = w;
	this.H = h;
	this.type = type;
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
				}else if (map[i][j] == 1 ){
					console.log("x "+i+" y "+j);
					ground[i][j] = new Block("../img/temple_ground.png",j*64,i*64,64,64,"ground"); // creating the platform
				}else if (map[i][j] == 2){
					ground[i][j] = new Block("../img/Moneybag.png", j*64,i*64,64,64,"money");
					MoneyBg = ground[i][j];
				}else if (map[i][j] == 3){
					ground[i][j] = new Block("../img/temple_ground.png",j*64,i*64,64,64,"wall");
				}else if (map[i][j] == 4){
					ground[i][j] = new Block ("../img/Spike.png", j*64,i*64,64,64,"spike");
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
			seedChance = Math.floor(stats[0]);
			extraChance = Math.floor(stats[1])
			break;
		case 1: //sidescroller
			playerMove();
			if (sdcPlayer.jump == true){
				jump1();
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
			
			enemyAi();//handles the enemy Ai
			break;
		case 2: //platformer
			movement();
			movePlayer();
			break;
		case 3: //map

			break;
	}
	for (i = 0; i < 4; i++){
		for (j = 0; j < 4; j++){
			if (farmPlot[i][j].growing == true){
				growUp(farmPlot[i][j]);
			}
		}
	}
	shopUpdate();
	render();
}
function shopUpdate(){
	textUpdate(potatoBtn,potato.seed+"             "+potato.plant); 
	textUpdate(tomatoBtn,tomato.seed+"             "+tomato.plant); 
	textUpdate(carrotBtn,carrot.seed+"             "+carrot.plant); 
	textUpdate(invPotato,"Potatoes: "+potato.plant); 
	textUpdate(invTomato,"Tomato: "+tomato.plant); 
	textUpdate(invCarrot,"Carrot: "+carrot.plant); 
	
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
					for (i = 0; i < 4; i++){
						for (j = 0; j < 4; j++){
							if (clickCheck(xClick,yClick,farmPlot[i][j]) == true){ //check to see which square they clicked on
								if (farmPlot[i][j].growing == false && farmPlot[i][j].harvest == false && selected != plantNull ){ // checks if the square is empty and tells that square to grow
										if (plantHolder[selected].seed > 0){
										farmPlot[i][j].seed = selected;
										farmPlot[i][j].growing = true;
										farmPlot[i][j].img = plantHolder[selected].img[0];
										plantHolder[selected].seed -= 1; // removes the selected seed type from player inventory
										
										planting.play();
									}

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
				if(clickCheck(xClick,yClick,buyBtn0) == true){ // check if they clicked the buy button
					if (selected != plantNull && gold > 0){ // if they have a plant selected, and enough gold to buy a plant, buy it
						plantHolder[selected].seed++;
						gold -= plantHolder[selected].price;/*incorporated chr to decrease purchase value by 1 per 2 chr*/
						
					}
				}
				if (clickCheck(xClick,yClick,sellBtn0) == true){ // check if they clicked the sell button
					if (selected != plantNull && plantHolder[selected].plant > 0){ // if they have a plant selected and have a plant to sell, sell it
						plantHolder[selected].plant -= 1;
						gold += plantHolder[selected].sell + goldBonus;/*incorporated chr to increase sell value by 10 for each chr point*/
						
					}
				}
				if (clickCheck(xClick,yClick,eatBtn0) == true){ // check if they clicked the eat button
					if (selected != plantNull && plantHolder[selected].plant > 0){ // if they have a plant selected, and a plant to eat, eat it
						plantHolder[selected].plant -= 1;
						stats[plantHolder[selected].stat] += plantHolder[selected].boost*diminish;
						//diminish[plantHolder[selected].stat] /= 0.01;
						stats[plantHolder[selected].stat] += 1*diminish;
						console.log(stats[plantHolder[selected].stat]);
						
					}
				}
				for (var i = 0; i < plantHolder.length; i++){
 					if (clickCheck(xClick,yClick,buttonRender[i+plantBtnSt]) == true){
 						selected = i;
 						selX = buttonRender[i+plantBtnSt].x;
 						selY = buttonRender[i+plantBtnSt].y;
 						}
 				}
				if (clickCheck(xClick,yClick,leftArrow) == true) {
					if (arrow > 0) {
						arrow -= 1; //list index + 1
						selected -= 1; //list index + 1
						plantSel.img.src = plantHolder[arrow].img[3].src;
						plantSel.text = plantHolder[arrow].name;
						console.log("A1: " + arrow);
						console.log("This is selected: " +selected );
					}
				}
				if (clickCheck(xClick,yClick,rightArrow) == true) {
					if (arrow < plantHolder.length - 1){
						arrow += 1; //list index + 1
						selected += 1; //list index + 1
						plantSel.img.src = plantHolder[arrow].img[3].src;
						plantSel.text = plantHolder[arrow].name;
						console.log("A1: " + arrow);
						
						console.log("This is selected: " +selected );
					}
				}
				break;
			case 1://IN SHOP //shopitems = 50 shopy[6] = 350
				if(clickCheck(xClick,yClick,buyBtn1) == true){ // check if they clicked the buy button
					if (selected != plantNull && gold > 0){ // if they have a plant selected, and enough gold to buy a plant, buy it
						plantHolder[selected].seed++;
						gold -= plantHolder[selected].price;/*incorporated chr to decrease purchase value by 1 per 2 chr*/
					}
				}
				if (clickCheck(xClick,yClick,sellBtn1) == true){ // check if they clicked the sell button
					if (selected != plantNull && plantHolder[selected].plant > 0){ // if they have a plant selected and have a plant to sell, sell it
						plantHolder[selected].plant -= 1;
						gold += plantHolder[selected].sell  + goldBonus;/*incorporated chr to increase sell value by 10 for each chr point*/
					}
				}
				if (clickCheck(xClick,yClick,eatBtn1) == true){ // check if they clicked the eat button
					if (selected != plantNull && plantHolder[selected].plant > 0){ // if they have a plant selected, and a plant to eat, eat it
						plantHolder[selected].plant -= 1;
						stats[plantHolder[selected].stat] += plantHolder[selected].boost*diminish[plantHolder[selected].stat];
						diminish[plantHolder[selected].stat] /= 0.01;
						console.log("yum");
					}
				}
				if(clickCheck(xClick,yClick,dexTab) == true) { //clicks dex tab
					statSel = 0;
				}
					else if(clickCheck(xClick,yClick,intTab) == true) { //clicks int tab
						statSel = 1;
					}
					else if(clickCheck(xClick,yClick,chaTab) == true) {// clicks cha tab
						statSel = 2;
					}
					else {
						statSel = plantNull;
					} //dex int cha tabs

				if (clickCheck(xClick,yClick,leftArrow) == true) {
					if (arrow > 0) {
					arrow -= 1; //list index + 1
					plantSel.img.src = plantHolder[arrow].img[3].src;
					plantSel.text = plantHolder[arrow].name;
					console.log(arrow);
					}
				}
				if (clickCheck(xClick,yClick,rightArrow) == true) {
					if (arrow < plantHolder.length - 1){
						arrow += 1; //list index + 1
						plantSel.img.src = plantHolder[arrow].img[3].src;
						plantSel.text = plantHolder[arrow].name;
						console.log(arrow);
					}
				}
			} 
				break;
			case 2://IN MAP
				break;
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
		sdcPlayer.x -= sdcPlayer.hspeed + Math.floor(stats[0]);
	}if (rightMove == true && sdcPlayer.x + sdcPlayer.w < canvas.width){
		sdcPlayer.x += sdcPlayer.hspeed + Math.floor(stats[0]);;
	}if (backMove == true && sdcPlayer.floorY > stageHeight){
		sdcPlayer.floorY -= sdcPlayer.vspeed + Math.floor(stats[0]);;
		sdcPlayer.y -= sdcPlayer.vspeed + Math.floor(stats[0]);;
	}if (forMove == true && sdcPlayer.y + sdcPlayer.h < canvas.height){
		sdcPlayer.floorY += sdcPlayer.vspeed + Math.floor(stats[0]);;
		sdcPlayer.y += sdcPlayer.vspeed + Math.floor(stats[0]);;
	}
}
function jump1(){ //this is some awful jump code that makes the player spin in a fucking parabola
	sdcPlayer.y -= sdcPlayer.jspeed - sdcPlayer.grav;
	sdcPlayer.sprite = sdcPlayer.jSprite;
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
				sdcPlayer.sprite = sdcPlayer.bSprite;
			}
			break;
	}
}
function attack(){ //this spawns the player's attack
	console.log (sdcPlayer.hitboxR);
	sdcPlayer.sprite = sdcPlayer.aASprite;
	sdcPlayer.hitboxC ++;
	sdcPlayer.hitboxX = sdcPlayer.x+sdcPlayer.w;
	sdcPlayer.hitboxY = sdcPlayer.y+(sdcPlayer.h/4);
	if (sdcPlayer.hitboxR == true){
		for (i=0; i < mArray.length; i++){ //this is checking collision with enemies and damaging them
			if (!(sdcPlayer.hitboxY > mArray[i].y+195 ||
				  sdcPlayer.hitboxY+32 < mArray[i].y ||
				  sdcPlayer.hitboxX > mArray[i].x+104 ||
				  sdcPlayer.hitboxX+32 < mArray[i].x)){
				if (mArray[i].isHit == false){
					mArray[i].health -= sdcPlayer.dmg + Math.floor(stats[1]);
					mArray[i].isHit = true; //is hit stops the enemy from taking damage on every frame of player attack, they only take damage once
					if(mArray[i].health <= 0){
						gold += mArray[i].goldV + Math.floor(stats[2])
						mArray.splice(i,1);
					}

				}
			}
		}
		if(mArray.length == 0){
			alert("You beat that wave, spawning new wave");
			spawn();
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
		sdcPlayer.sprite = sdcPlayer.bSprite;
		sdcPlayer.hitboxC = 0;
	}
}
function spawn(){ //spawns enemies
	for (i = 0; i < spawnMax; i++){ //spawnMax is the max number of enemies we can spawn, currently it's 7
		switch (sArray[sAcount][i]){ //this checks the array storing our planned enemy compositions, sAcount stores the current difficulty/spawn wave, i is the enemy we're spawning
			case 1:
				mArray[i] =  new Enemy ("archer","../img/snake1.png","../img/snakeATK.png","../img/snakeBLT.png",5,4,5,50,10,true);//creates a new archer
				mArray[i].x = 510;
				mArray[i].y = i*70+230;

				if(mArray[i].y >= 400){
					var j = i-3;
					mArray[i].x = 700;
					mArray[i].y = j*70+230;
				}//spawns behind after 3rd enemy

				mArray[i].rAtkX = mArray[i].x;
				mArray[i].rAtkY = mArray[i].y;//sets the x,y values for the archer projectile
				break;
			case 2:
				mArray[i] = new Enemy ("soldier","../img/Skuller1L.png","../img/SkullerATKL.png","../img/SkullerATK_WpnL.png",10,2,2,20,70,false);//creates a new soldier
				mArray[i].x = 510;
				mArray[i].y = i*70+230;
				if(mArray[i].y >= 400){
					var j = i-3;
					mArray[i].x = 700;
					mArray[i].y = j*70+230;
				}
				mArray[i].side = mArray[i].x - (2 * mArray[i].aW);
				mArray[i].mAtkY = mArray[i].y;
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

function enemyAi() {
	for (i = 0; i < mArray.length; i++)
	{
		if(mArray[i].name == "archer"){
		mArray[i].rAtkX -= mArray[i].projSp;
		mArray[i].bullDist += 1;
		mArray[i].fCount ++;
		console.log(mArray[i].fCount);
		if(mArray[i].fCount == 5){
			
			if(mArray[i].fNum ==3)
					mArray[i].fNum = 1; 
			var hold = new Image();
			hold.src = "../img/snake"+mArray[i].fNum+".png";
			mArray[i].fNum++;
			mArray[i].fCount = 0;
			mArray[i].Sprite = hold;
		}
		if(mArray[i].bullDist >= 150)
		{	mArray[i].Sprite = mArray[i].aASprite;
			mArray[i].rAtkX = mArray[i].x;
			mArray[i].bullDist = 0;			
		}
		if(mArray[i].bullDist == 10)
			mArray[i].Sprite = mArray[i].bSprite;
		if (sdcPlayer.isHit == false){
			if (!(mArray[i].rAtkY > sdcPlayer.y+230 ||
					  mArray[i].rAtkY + 32 < sdcPlayer.y ||
					  mArray[i].rAtkX > sdcPlayer.x +112||
					  mArray[i].rAtkX + 32 < sdcPlayer.x)){
				if (sdcPlayer.isHit == false){
					sdcPlayer.isHit = true;
					sdcPlayer.health -= mArray[i].attack;
					if(sdcPlayer.health <= 0){
						alert("You lost");
						sAcount = 0;
						mArray = [];
						waveTB = true;
						sdcPlayer.health = sdcPlayer.healthMax;
						cG = 0;
					}
				}
			}
		}//player takes damage
		}
		if(mArray[i].name == "soldier"){
			
			if(mArray[i].deltaMove < 100)
			{
				mArray[i].mAtkX = mArray[i].x + mArray[i].side;//constantly traces the soldiers position for its attack
				if(mArray[i].mAtk == true){
					if (sdcPlayer.isHit == false){
								if (!(mArray[i].mAtkY > sdcPlayer.y+230 ||
									  mArray[i].mAtkY + 32 < sdcPlayer.y ||
									  mArray[i].mAtkX > sdcPlayer.x+112 ||
									  mArray[i].mAtkX + 32 < sdcPlayer.x)){
									if (sdcPlayer.isHit == false){
										sdcPlayer.isHit = true;
										sdcPlayer.health -= mArray[i].attack;
										if(sdcPlayer.health <= 0){
											alert("You lost");
											sAcount = 0;
											waveTB = true;
											mArray = [];
											sdcPlayer.health = sdcPlayer.healthMax;
											cG = 0;
										}
									}
								}
							}
				}//player takes damage
				mArray[i].fCount++;
					if(mArray[i].fCount == 10){
				
					if(mArray[i].fNum == 4)
							mArray[i].fNum = 1; 
					var hold = new Image();
					hold.src = "../img/Skuller"+mArray[i].fNum+mArray[i].facing+".png";
					mArray[i].fNum++;
					mArray[i].fCount = 0;
					mArray[i].Sprite = hold;
				}
				if(mArray[i].deltaMove == 10)
				{
					mArray[i].Sprite = mArray[i].bSprite;
					mArray[i].mAtk = false;
				}//stops the attack

				mArray[i].x -= mArray[i].speed;
				mArray[i].deltaMove ++;
			}//moves the soldier

			if(mArray[i].deltaMove == 100)
			{
				if(mArray[i].speed == 1){
					mArray[i].side = -(2 * mArray[i].aW);
					mArray[i].mAtk = true;
					var hold = new Image();
					var hold1 = new Image();
					hold.src = "../img/SkullerATKL.png";
					mArray[i].Sprite = hold;
					hold1.src = "../img/SkullerATK_WpnL.png";
					mArray[i].Attack = hold1;
					
				}
				if(mArray[i].speed == -1){
					mArray[i].side = (3.5 * mArray[i].aW);
					mArray[i].mAtk = true;
					var hold = new Image();
					var hold1 = new Image();
					hold.src = "../img/SkullerATKR.png";
					mArray[i].Sprite = hold;
					hold1.src = "../img/SkullerATK_WpnR.png";
					mArray[i].Attack = hold1;
				}
				
				mArray[i].deltaMove = 0;
				mArray[i].speed = -mArray[i].speed;
				if(mArray[i].speed == -1)
					mArray[i].facing = "R";
				if(mArray[i].speed == 1)
					mArray[i].facing = "L";
			}//swaps the direction and makes an attack on the approrite side
		}
	}//handles the Ai for the enemies

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

//===========================================================================================
//PLATFORMER CODE BLOCK
function movement(){
	pltPlayer.gav = 10;
	
	
	pltPlayer.X += pltPlayer.V_X;
	pltPlayer.Y += pltPlayer.V_Y;
	
	
	
	if (pltPlayer.V_Y < pltPlayer.gav)
		pltPlayer.V_Y += pltPlayer.weight;
	for ( var i = 0; i < map.length; i++){
		for (var j = 0; j < map[i].length; j++){
			if (map[i][j] == 1 || map[i][j] == 3){
				if (pltPlayer.collision(ground[i][j]) && pltPlayer.Y + pltPlayer.H < ground[i][j].Y + pltPlayer.V_Y){
					pltPlayer.Y = ground[i][j].Y - pltPlayer.H;
					pltPlayer.V_Y = 0;
				}
			}
		}
	}
	animatePlayer();
	//console.log("plyerX  "+pltPlayer.X);
	currentX = (pltPlayer.X+40-map_vx)/64;
	//console.log(currentX);
	for (var i = 0; i < map.length; i++){
		for( var j = 0; j< map[i].length; j++){
			if(map[i][j] == 3 && faceRight == true)
				checkCollisionLeft(ground[i][j]); 
			else if(map[i][j] == 3 && faceRight == false)
				checkCollisionRight(ground[i][j]);
		}
	}
	//console.log(map_vx);
	if(pltPlayer.V_X != 0){
		for( var i = 0; i < map.length; i++){
			for( var j = 0; j < map[i].length; j++){
				if(map[i][j] == 1 || map[i][j] == 2 || map[i][j] == 3|| map[i][j] == 4)
					ground[i][j].X += -map_vx;
			}
		}
	}
	
	pltResult();
}
function pltResult(){	
    if (Spike.Y == pltPlayer.Y + pltPlayer.H || Spike.Y <= pltPlayer.Y + pltPlayer.H )
	{
		pltPlayer.leftPressed = pltPlayer.rightPressed = pltPlayer.upPressed = false;
		pltPlayer.Y = Spike.Y + Spike.H - pltPlayer.Y;
		hurt.play();
		console.log("Failed");
		window.alert("You got wounded and lost some gold!")
		gold = gold - 50;
		cG = 0;
		pltRespawn();
	}
	if (pltPlayer.X + pltPlayer.W >= MoneyBg.X + 30 && pltPlayer.Y + pltPlayer.H >= MoneyBg.Y + 30)
	{
		pltPlayer.leftPressed = pltPlayer.rightPressed = pltPlayer.upPressed = false;
		console.log("Win");
		window.alert("You found some Gold!");
		gold += 100 + Math.floor(stats[2]);//adds chr to gold gain
		cG = 0;
		pltRespawn();
	}
}
function pltRespawn(){
	for( var i = 0; i < map.length; i++){
		for( var j = 0; j < map[i].length; j++){
			if(map[i][j] == 1 || map[i][j] == 2 || map[i][j] == 3|| map[i][j] == 4)
				ground[i][j].X = j*64;
		}
	}
	
	pltPlayer.X = 64;
	pltPlayer.Y = 300;
	pltPlayer.V_X = 0;
}
function checkCollisionRight(ground){
	if(pltPlayer.collision(ground)){
		if(pltPlayer.X + pltPlayer.W > ground.X && pltPlayer.Y + pltPlayer.H > ground.Y && pltPlayer.Y < ground.Y+ground.H)  {
			console.log("left"+ ground);
			pltPlayer.X = ground.X + ground.W - 25;
			pltPlayer.V_X = 0;
			map_vx = 0;
		}
	}
}
function checkCollisionLeft(ground){
	if(pltPlayer.collision(ground)){
		if(pltPlayer.X + 25 < ground.X + ground.W  && pltPlayer.Y + pltPlayer.H > ground.Y && pltPlayer.Y < ground.Y+ground.H) {
			console.log("right");
			pltPlayer.X = ground.X - 45;
			pltPlayer.V_X = 0;		
			map_vx = 0;
		}
	}
}

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
		pltPlayer.V_X = -0.04+Math.floor(stats[0]);//adds dex to movement speed
		pltPlayer.Sprite.src = "../img/CharAnimL.png";
		if(onGround){
		footStep.play();
		footStep.volume = 0.01;
		}
	}
	if(pltPlayer.rightPressed){
		faceRight = true;
		map_vx = 8;
		pltPlayer.V_X = 0.04+Math.floor(stats[0]);//adds dex to movement speed
		pltPlayer.Sprite.src = "../img/CharAnimR.png";
		if(onGround){
		footStep.play();
		footStep.volume = 0.01;
		}
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
		onGround = false;
		jump.play(); //play sound fx while jumping
		jump.volume = 0.1; //set sound volume to 0.1
	}

}
//===========================================================================================
//RENDER
function render(){
	renderer.clearRect(0,0,canvas.width,canvas.height);
	switch (cG){
		case 0:
			renderer.drawImage(selRender,selX,selY);
			for (i = 0; i < 3; i++){ //renders stats on screen
				renderer.fillText(statName[i],selposX,selposY[i]+200);
				renderer.fillText(stats[i],selposX+50,selposY[i]+200);
				
			}
			renderer.fillText("Gold: ",selposX,selposY[2]+240);
			renderer.fillText(gold, selposX+50,selposY[2]+240);
		switch (tab) {
			case 0: // farm tab
				
				for (i = 0; i < 4; i++){ //draws the farm plots
					for (j = 0; j < 4; j++){
						renderer.drawImage(farmPlot[i][j].img,farmPlot[i][j].x,farmPlot[i][j].y);
					}
				}
			
				break;
			case 1: // shop tab
				break;
			switch(statSel) { //stat tab functionality
				case 0:
				//changes img of dex tab when clicked
					buttonRender[23].img.src = "../img/DexTabSel.png";
					buttonRender[24].img.src = "../img/IntTab.png";
					buttonRender[25].img.src = "../img/ChaTab.png";
					//plantSel.img.src = plantHolder[selected].img[3].src; //changes the plantSel img.src
					break;
				case 1:
				//changes img of int tab when clicked
					buttonRender[23].img.src = "../img/DexTab.png";
					buttonRender[24].img.src = "../img/IntTabSel.png";
					buttonRender[25].img.src = "../img/ChaTab.png";
					//plantSel.img.src = plantHolder[selected].img[3].src; //changes the plantSel img.src
					break;
				case 2:
				//changes img of cha tab when clicked
					buttonRender[23].img.src = "../img/DexTab.png";
					buttonRender[24].img.src = "../img/IntTab.png";
					buttonRender[25].img.src = "../img/ChaTabSel.png";
					//plantSel.img.src = plantHolder[selected].img[3].src; //changes the plantSel img.src
					break;
			}
				break;
			case 2:
				break;

		}
			/*
			if (tab == 1){
				goldT = gold.toString();
				renderer.clearRect(0,0,canvas.width,canvas.height);
				stage.style.backgroundColor = "white";
				renderer.fillText("Gold: "+goldT,550,shopY[7]);
				renderer.fillText("Store",50,shopY[0]);
				renderer.fillText("Inventory",550,shopY[0]);
				renderer.drawImage(buyImg,50,shopY[6]+40);
				renderer.drawImage(selRender,50,shopY[6]+40); //buy button
				renderer.drawImage(sellImg,50+70,shopY[6]+40);
				renderer.drawImage(selRender,50+70,shopY[6]+40); //sell button
				renderer.drawImage(eatImg,50+140,shopY[6]+40);
				renderer.drawImage(selRender,50+140,shopY[6]+40); //eat button
				for (i = 0; i < 6; i++){
				storeT = storeStrings[i].toString();
				renderer.fillText(storeT,550,shopY[i+1]); //inventory strings
				}
				for (i = 0; i < 6; i++){
				seedT = seeds[i].toString();
				plantT = plants[i].toString();
				renderer.fillText(seedT,550+225,shopY[i+1]);
				renderer.fillText(plantT,550+225,shopY[i+1]+150);
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
			renderer.drawImage(backgroundSS,0,0);
			renderer.drawImage(sdcPlayer.shadow,sdcPlayer.x+85,sdcPlayer.floorY+180);
			renderer.drawImage(sdcPlayer.sprite,sdcPlayer.x,sdcPlayer.y);
			for (i = 0; i < mArray.length; i++)
			{
				renderer.drawImage(mArray[i].Sprite, mArray[i].x, mArray[i].y);//draws each enemy

				if(mArray[i].name == "archer")
				{
					renderer.drawImage(mArray[i].Attack, mArray[i].rAtkX, mArray[i].rAtkY);//draws each bullet for the archers
				}
				if(mArray[i].mAtk == true)
				{
					renderer.drawImage(mArray[i].Attack, mArray[i].mAtkX, mArray[i].mAtkY);
				}//renders the melee attack

				renderer.fillText (mArray[i].health,mArray[i].x,mArray[i].y);
			}
			if (sdcPlayer.hitboxR == true){
				renderer.drawImage(sdcPlayer.aSprite,sdcPlayer.hitboxX,sdcPlayer.hitboxY);
			}
			renderer.fillText(sdcPlayer.health,840,20);
			break;
			break;
		case 2:
			renderer.drawImage(pltBG, 0 ,0);
			renderer.drawImage(pltPlayer.Sprite,
							   pltPlayer.SIZE*playerSprite, 0, pltPlayer.SIZE, 64,
							   pltPlayer.X, pltPlayer.Y, pltPlayer.SIZE, pltPlayer.SIZE);
			for ( var i = 0; i < map.length; i++){
				for (var j = 0; j < map[i].length; j++){
					if (map[i][j] == 1)
						renderer.drawImage(ground[i][j].Sprite,ground[i][j].X, ground[i][j].Y);	
					else if (map[i][j] == 2)
						renderer.drawImage(MoneyBg.Sprite, MoneyBg.X, MoneyBg.Y);
					else if (map[i][j] == 3)
						renderer.drawImage(ground[i][j].Sprite,ground[i][j].X, ground[i][j].Y);
					else if (map[i][j] == 4)
						renderer.drawImage(Spike.Sprite, Spike.X, Spike.Y);
					
				}
			}
			break;
	}
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
}