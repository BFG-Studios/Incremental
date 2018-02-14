//canvas stuff
window.addEventListener("click", onClick);
var canvas = document.querySelector("canvas");
canvas.width = 860;
canvas.height = 560;
var renderer = canvas.getContext("2d");
renderer.font = "20px Arial";
//variable declaration
var xImg;
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
var shop = 0;
var shopY = [50,100,150,200,250,300,350,400];
var shopItemsX = 50;
var invItemsX = 550;
var storeT;
var storeStrings = ["Potato Seed","Tomato Seed","Carrot Seed","Potato Plant","Tomato Plant","Carrot Plant"];
var storeSeed = 0;
var storePlant = 0;

startFunc();
//initialization function
function startFunc(){
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
	xImg.src = "../img/XButton.png";
	baseImg.src = "../img/Soil.png";
	shopImg.src = "../img/Shop.png";
	sellImg.src = "../img/Sell.png";
	buyImg.src = "../img/Buy.png";
	eatImg.src = "../img/Eat.png";
	pbImg.src = "../img/PotatoButton.png";
	tbImg.src = "../img/TomatoButton.png";
	cbImg.src = "../img/CarrotButton.png";
	selRender.src = "../img/Border.png";
	plusImg.src = "../img/PlusButton.png";
	minusImg.src = "../img/MinusButton.png";
	plantImg = []; //the array that stores the various plant pictures, it's an array so i don't have to use a million if statements
	plantImg[0] = []; //this makes it multidimensional much to my chagrin
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
	plantImg[0][0].src = "../img/Plant0.png"; // these are the src for each plant's life cycle, 0 is potato, 1 is tomato, 2 is carrot
	plantImg[1][0].src = "../img/Plant0.png";
	plantImg[2][0].src = "../img/Plant0.png";
	plantImg[0][1].src = "../img/Plant1.png";
	plantImg[1][1].src = "../img/Plant1.png";
	plantImg[2][1].src = "../img/Plant1.png";
	plantImg[0][2].src = "../img/Plant2.png";
	plantImg[1][2].src = "../img/Plant2.png";
	plantImg[2][2].src = "../img/Plant2.png";
	plantImg[0][3].src = "../img/Potato.png";
	plantImg[1][3].src = "../img/Tomato.png";
	plantImg[2][3].src = "../img/Carrot.png";
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
	uInt = setInterval(update, 33.34);
}
//update function, duh
function update(){
	for (i = 0; i < 4; i++){
		for (j = 0; j < 4; j++){
			if (farmPlot[i][j].growing == true){
				growUp(farmPlot[i][j]);
			}
		}
	}
	render();
}
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
function onClick(e){
	var xClick = e.pageX - canvas.offsetLeft;
	var yClick = e.pageY - canvas.offsetTop;
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
							}
							if (farmPlot[i][j].harvest == true){ //checks if the square is harvestable, takes the plant into the inventory and returns to it's start state
								plants[farmPlot[i][j].seed] += 1;
								farmPlot[i][j].harvest = false;
								farmPlot[i][j].seed = 3;
								farmPlot[i][j].img = baseImg;
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
				gold += 50;
			}
		}
	}
	if(xClick > 490 && xClick < 550){ // check if they clicked the buy button
		if (yClick > 60 && yClick < 90){
			if (selected != 3 && gold > 0){ // if they have a plant selected, and enough gold to buy a plant, buy it
				seeds[selected]++;
				gold -= 25;
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
	if(xClick > 825 && xClick < 855){
		if (yClick > 5 && yClick < 35){ 
		shop = 0;
		stage.style.backgroundColor = "#202316";
		}
	}
	if (shop == 1){
		if (yClick > 320 && yClick < 384) {
			if (xClick > 50 && xClick < 114) {
				selected = 0;
			}
			else if (xClick > 118.3 && xClick < 182.3) {
				selected = 1;
			}
			else if (xClick > 186.6 && xClick < 250.6) {
				selected = 2;
			}
			else {
				selected = -1;
			}
		}
	}
}

				
//render function
function render(){
	renderer.clearRect(0,0,canvas.width,canvas.height);
	renderer.drawImage(shopImg,490,0);
	renderer.drawImage(sellImg,490,30); // draws all the buttons
	renderer.drawImage(buyImg,490,60);
	renderer.drawImage(eatImg,490,90);
	renderer.drawImage(pbImg,selPosX,selPosY[0]);
	renderer.drawImage(tbImg,selPosX,selPosY[1]);
	renderer.drawImage(cbImg,selPosX,selPosY[2]);
	renderer.drawImage(selRender,selX,selY);
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
	if (shop == 1){
		goldT = gold.toString();
		renderer.clearRect(0,0,canvas.width,canvas.height);
		stage.style.backgroundColor = "white";
		renderer.fillText("Gold: "+goldT,invItemsX,shopY[7]);
		renderer.fillText("Store",shopItemsX,shopY[0]);
		renderer.fillText("Inventory",invItemsX,shopY[0]);
		renderer.drawImage(xImg,825,5); //x button
		renderer.drawImage(buyImg,shopItemsX,shopY[6]+40);
		renderer.drawImage(selRender,shopItemsX,shopY[6]+40); //buy button
		renderer.drawImage(sellImg,shopItemsX+70,shopY[6]+40);
		renderer.drawImage(selRender,shopItemsX+70,shopY[6]+40); //sell button
		renderer.drawImage(eatImg,shopItemsX+140,shopY[6]+40);
		renderer.drawImage(selRender,shopItemsX+140,shopY[6]+40); //eat button
		renderer.drawImage(plantImg[0][3],shopItemsX,shopY[6]-30); //potato
		renderer.drawImage(plantImg[1][3],shopItemsX+68.3,shopY[6]-30); //tomato
		renderer.drawImage(plantImg[2][3],shopItemsX+136.6,shopY[6]-30); //carrot
		if (selected == 0) {
		renderer.fillText("You have selected the potato.", shopItemsX,450);
	}
	else if (selected == 1) {
		renderer.fillText("You have selected the tomato.", shopItemsX,450);
	}
	else if (selected == 2) {
		renderer.fillText("You have selected the carrot.", shopItemsX,450);
	}
	else {
		renderer.fillText("You have selected ", shopItemsX,450);
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
}