var dog, database, foodS, foodStock;
var fedTime, lastFed, feed, currentTime;
var foodObj;
var readState, gameState;

var bedroom, washroom, garden, livingroom;
var dogImg, happyDogImg, sadDog;
var backgroundImg;


function preload(){

  dogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/happydog.png");
  bedroom = loadImage("images/Bed Room.png");
  washroom = loadImage("images/Wash Room.png");
  garden = loadImage("images/Garden.png");
  livingroom = loadImage("images/Living Room.png");
  // sadDog = loadImage("images/")

}

function setup() {
	createCanvas(1000, 400);

  database = firebase.database();
  foodStock = database.ref("Food");
  foodStock.on("value", readStock);
 
  readState = database.ref("gameState");
  readState.on("value", function(data){
    gameState = data.val();
  });

  fedTime= database.ref("FeedTime");
  fedTime.on("value", function(data){
    lastFed =  data.val();
  })

  foodObj = new Food();

  dog = createSprite(width/2-30,height/2, 50,50);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  feed= createButton("Feed The Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood= createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  
}


function draw() {  


  currentTime = hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg)
  }

  drawSprites();
}
 


function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDogImg);
  foodObj.deductFood();
  foodObj.updateFoodStock(foodObj.getFoodStock());
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
    // gameState: 'Hungry'
  })
}


function addFoods(){
  foodS++;
  database.ref('/').update({
   Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState: state
  });
}
    

//EXTRA CODES----------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------


  // if(foodS !== undefined){

  //   textSize(20);
  //   fill(0);
  //   text("NOTE: Press UP_ARROW to feed the Drago milk!", width/2-200, 100 );
  //   text("Food left:"+ foodS, width/2-40, 130);

  //   if(keyWentDown(UP_ARROW)){
  //   writeStock(foodS);
  //   dog.addImage(happyDogImg)
  //  }
  //   if(keyWentUp(UP_ARROW)){
  //   dog.addImage(dogImg)
  //  }
  //  if(foodS === 0){
  //    foodS =  20;
  //  }


  // function writeStock(x){
  //   if(x<=0){
  //     x=0
  //   }else{
  //     x = x-1;
  //   }
  //   database.ref("/").update({
  //     Food:x
  //   })
  //   }
  