var PLAY = 1;
var END = 0;
var gameState = PLAY;

var shark, shark_running, shark_collided;
var bground, backgroundImage,invisibleGround;

var netGroup, netImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var distScore=0;
var score=0;
var gameOver, restart;

var gameOverImg;
var restartImg;

var fishimg;

function preload(){
  shark_running =   loadAnimation("images/Shark1.png","images/Shark2.png","images/Shark4.png","images/Shark5.png");
  shark_collided = loadAnimation("images/Shark3.png");
  fishimg=loadAnimation("images/tile000.png","images/tile001.png","images/tile002.png","images/tile003.png","images/tile004.png","images/tile005.png");
  
  backgroundImage = loadImage("images/oceanbg.png");
  
  netImage = loadImage("images/fishnet.png");
  
  obstacle1 = loadImage("images/seaweed.png");
  obstacle2 = loadImage("images/seaweed2.png");
  obstacle3 = loadImage("images/seaweed3.png");
 
  gameOverImg = loadImage("images/gameover.png");
  restartImg = loadImage("images/restart.png");
  
 
}

function setup() {
  createCanvas(1000,748);
  
  bground = createSprite(width/2,height/2,width,height);
  bground.addImage("ground",backgroundImage);
  bground.x = bground.width /2;
  
  shark = createSprite(150,180,20,50);
  shark.addAnimation("running", shark_running);
  shark.addAnimation("collided", shark_collided);
  shark.scale = 0.7;
  
  gameOver = createSprite(width/2,height/2-100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+100);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,740,width,10);
  invisibleGround.visible = false;
  
  netsGroup = new Group();
  obstaclesGroup = new Group();
  fishGroup = new Group();

  
  distScore = 0;
}

function draw() {
  background(255);
  if (gameState===PLAY){
    distScore = distScore + Math.round(getFrameRate()/60);
    bground.velocityX = -(6 + 3*distScore/100);
  
    if(keyDown("space") && shark.y >= 400) {
      //jumpSound.play();
      shark.velocityY = -14;
    }
  
    shark.velocityY = shark.velocityY + 0.8
  
    if (bground.x < 0){
      bground.x = bground.width/2;
    }
  
    shark.collide(invisibleGround);
    spawnnets();
    spawnObstacles();
    spawnfish();
     
      for(var i=0;i<fishGroup.length;i++){
        if(fishGroup.get(i).isTouching(shark)){
          fishGroup.get(i).destroy();
          score=score+10;
        }
      }
    
    if(obstaclesGroup.isTouching(shark)||netsGroup.isTouching(shark)){
     
      gameState = END;
        
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    bground.velocityX = 0;
    shark.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    netsGroup.setVelocityXEach(0);
    fishGroup.setVelocityXEach(0);
    
    //change the shark animation
    shark.changeAnimation("collided",shark_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    netsGroup.setLifetimeEach(-1);
    fishGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
    drawSprites();
    textSize(35);
    fill("black");
    stroke("white");
    text("Distance: "+ distScore, width-300,50);
    text("Score: "+ score, width-300,100);

}

function spawnnets() {
  //write code here to spawn the nets
  if (frameCount % 250 === 0) {
    var net = createSprite(width,225,40,10);
    net.addImage(netImage);
    net.scale = 0.5;
    net.velocityX = -(6 + 3*distScore/100);
    
     //assign lifetime to the variable
    net.lifetime = width/3;
    
    //net.debug=true;
    net.setCollider("circle",35,70,50);
    //add each net to the group
    netsGroup.add(net);
  }
  
}

function spawnfish() {
  //write code here to spawn the fish
  if (frameCount % 130 === 0) {
    var fish = createSprite(width+50,random(250,height-50),40,10);
    fish.addAnimation("fish",fishimg);
    fish.scale = 0.2;
    fish.velocityX = -(5 + 3*distScore/100);
    
     //assign lifetime to the variable
    fish.lifetime = width/3;
    
    //.debug=true;
    restart.depth=fish.depth+1;
    //fish.setCollider("circle",35,70,50);
    //add each fish to the group
    fishGroup.add(fish);
  }
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(width,height-50,10,40);
    obstacle.velocityX = -(6 + 3*distScore/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.4;
    //obstacle.debug=true;
    obstacle.setCollider("circle",0,0,150);
    obstacle.lifetime = width/6;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  bground.velocityX = -(6 + 3*distScore/100);
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  netsGroup.destroyEach();
  fishGroup.destroyEach();
  
  shark.changeAnimation("running",shark_running);
  
  distScore = 0;
  score=0;
}
