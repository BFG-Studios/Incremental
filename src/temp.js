//plant function and plant related variables
var plantHolder[]; //array for calling plants by id
function Plant(gt,id,img,stat,price,sell,seed){
	this.gt = gt; //dictates interval the plant will change growstates at
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
var plantNull = plantHolder.length + 1;
//============================================
//--------------------------------------------
//button function and button related variables
var buttonRender[]; //array for calling buttons by id
function Button(id,x,y,w,h,cG,tab,tB,text,textX,textY,img){
	this.img = new Image(); //basic image for the button
	this.imgP = new Image(); //image for when the button is pressed
	this.img.src = img;
	this.x = x; //x coordinate
	this.y = y; //y coordinate
	this.w = w; //width of the button
	this.h = h; //height of the button
	this.cG = cG; //game state to load the button in
	this.tab = tab; //tab to load the button in
	this.tB = textBool //for stating whether a button has in render text over it
	this.text = text; //for rendering text on the button;
	this.tX = textX; //for editing placement of text on a button
	this.tY = textY;
	buttonRender[id] = this; //for rendering and discerning different buttons via #
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
var potatoBtn = new Button(17,selposX,selposY[0],60,30,true,potato.seed "       " potato.plant,selposX,selposY[0],"../img/potatoButton.png");
var tomatoBtn = new Button(18,selposX,selposY[1],60,30,true,tomato.seed "       " tomato.plant,selposX,selposY[1],"../img/tomatoButton.png");
var carrotBtn = new Button(19,selposX,selposY[2],60,30,true,carrot.seed "       " carrot.plant,selposX,selposY[2],"../img/carrotButton.png");

//============================================
//--------------------------------------------
//player related/ miscellaneous variables
var seedChance = 50;
var extraChance = 0;
var goldBonus = 0;
var harvest = new Audio("../wav/Harvest.wav"); //audio variables
var bonus = new Audio("../wav/Bonus.wav");
var planting = new Audio("../wav/Planting.wav");
var tabs = 0;
var baseImg; //soil image;
var farmPlot[];
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
//INSTANTIATION
function startFunc(){
	baseImg = new Image;
	baseImg.src = "../img/Soil.png";
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
}
//============================================
function render(){
	for (i = 0; i < buttonRender.length; i++){ //checks and renders every button
		if (buttonRender[i].cG == cG){ //is the button in this gamestate?
			if (buttonRender[i].tab == tab){ //is the button in this tab?
				renderer.drawImage(buttonRender[i].img,buttonRender[i].x,buttonRender[i].y); //draw the button
				if (buttonRender[i].textBool == true){ //does the button have text to render?
					renderer.fillText(buttonRender[i].text,buttonRender[i].textX,buttonRender[i].textY); //render the text
				}
			}
		}
	}
	for (i = 0; i < 3; i++){
		renderer.fillText(statName[i],selPosX,selPosY[i]+200);
		renderer.fillText(stats[i],selPosX+50,selPosY[i]+200);
	}
}