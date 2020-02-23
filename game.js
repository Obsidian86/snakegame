let prompt = document.getElementById("prompt");
document.getElementsByClassName("startGame")[0].addEventListener("click", function(){
  prompt.style.display = "none";
  restartGame();
});

//canvas settings 
const cellDim = 14; //20
const columns = 60;   //50
const rows = 40; //30
const startSpeed = 100;
let highScore = 0;
document.getElementById("snakeCanvas").style.width = columns * cellDim + "px";

// Game settings
let dir = [0, 1]; // starting direction - doesn't matter : either  -1 || 0 || 1
let speed = startSpeed; //set timeout seconds - starting speed 100-ish
let speedIncr = 3; //3 - speed increase per item
let curKey = 40;
let startGame; 
let started = 0; //0 1 or 2
let growthLevel = 93; //higher = less growth; 90 = 10% chance per tic, 100 = none
let lazerSpeed = 1; //.5 to 1
let gameScore = 0;

//Key functions 
let lazerActive = false;
let changeActive = false;
document.addEventListener("keydown", function(event){ 
      //If game hasn't started (1), sets the game to start
      if( started === 1 ){
        startGame = setInterval( function(){ moveSnake(); }, speed);
        started = 2; 
      }
      //If game has started (2), allows controls
      if( started === 2){
        //Fire Lazer - spacebar
        if(event.keyCode === 32){
          if( !lazerActive ){
            lazerActive = true;
            fireLazer(); 
          }
        } 
        
        // Change direction - arrow keys
        if(!changeActive){
          changeActive = true;
          switch(event.keyCode){ 
            case 37:
              if(curKey !== 39){
                dir = [-1, 0];
                curKey = event.keyCode;
              } 
              break;               
            case 40:
              if(curKey !== 38){
                dir = [0, 1]; 
                curKey = event.keyCode;
              }
              break;
            case 38:
              if(curKey !== 40 && started != 1){
                dir = [0, -1]; 
                curKey = event.keyCode;
              } 
              break;
            case 39:
              if(curKey !== 37){
                dir = [1, 0]; 
                curKey = event.keyCode;
              }
              break; 
          } //End Switch
        }

    } // End if

      
  
}); //End event listener
 
// col row
let snakePos = [
  [10, 10],
  [10, 9],
  [10, 8],
  [10, 7],
  [10, 6],
  [10, 5]
];

function setCanvas(){
  let grid = "";
  let col = 1;
  let row = 1;
  for( let i=0; i<(columns * rows); i++){
    grid += "<li class='col"+ col +" row" +  row;
    if( row === 1 || col === 1 || col === columns || row === rows){
      grid += " badCell";
    }
    grid += "'></li>";
    col++;
    if(col > columns){
      col = 1;
      row++;
    }
  }
  document.getElementById('snakeCanvas').innerHTML = grid;
  for(let i=0; i<document.getElementsByTagName('li').length; i++){
    document.getElementsByTagName('li')[i].style.height = cellDim + "px";
    document.getElementsByTagName('li')[i].style.width = cellDim + "px";
  }
  ////////////////////////////////////////////////
  let walls = [[21, 2],[21, 3],[21, 4],[21, 6],[21, 5],[21, 7],[21, 8],[21, 9],[20, 9],[20, 10],[19, 11],[20, 11],[19, 12],[19, 13],[18, 13],[17, 13],[16, 14],[16, 13],[2, 13],[3, 13],[3, 15],[3, 14],[4, 16],[3, 16],[5, 16],[6, 16],[7, 16],[21, 1],[15, 31],[15, 32],[15, 33],[15, 35],[15, 34],[15, 36],[16, 36],[18, 36],[17, 36],[20, 36],[21, 36],[22, 36],[23, 36],[24, 36],[19, 36],[24, 35],[24, 34],[25, 34],[26, 34],[28, 34],[29, 34],[27, 34],[31, 34],[30, 34],[31, 35],[31, 36],[31, 37],[31, 38],[31, 39],[2, 32],[3, 32],[4, 32],[5, 32],[6, 32],[6, 33],[6, 34],[6, 36],[6, 35],[59, 30],[58, 30],[57, 30],[55, 30],[56, 30],[54, 30],[54, 31],[53, 31],[53, 32],[52, 32],[52, 33],[52, 34],[51, 34],[50, 34],[49, 34],[56, 39],[56, 38],[56, 37],[56, 36],[52, 24],[53, 24],[53, 23],[53, 22],[53, 20],[53, 19],[53, 21],[53, 18],[53, 17],[53, 16],[53, 15],[53, 14],[53, 13],[53, 12],[53, 11],[53, 10],[53, 9],[54, 9],[54, 8],[54, 7],[54, 6],[54, 5],[53, 5],[52, 5],[51, 5],[50, 5],[49, 5],[48, 5],[46, 5],[45, 5],[47, 5],[44, 5],[43, 5],[42, 5],[42, 6],[42, 7],[31, 2],[31, 4],[31, 5],[31, 3],[31, 6],[31, 8],[31, 9],[31, 7],[31, 10],[31, 11],[32, 11],[34, 11],[35, 11],[33, 11],[37, 11],[38, 11],[39, 11],[40, 11],[36, 11],[25, 16],[24, 16],[23, 16],[30, 16],[31, 16],[32, 16],[32, 18],[32, 17],[23, 17],[23, 18],[23, 23],[23, 24],[23, 25],[24, 25],[25, 25],[32, 23],[32, 24],[32, 25],[31, 25],[30, 25],[2, 25],[4, 25],[5, 25],[3, 25],[7, 25],[6, 25],[7, 24],[7, 23],[41, 22],[41, 23],[41, 24],[41, 25],[41, 26],[41, 28],[41, 29],[41, 30],[41, 27],[40, 26],[42, 26],[43, 26],[39, 26]];
let startGrowth= [[24, 37],[24, 38],[24, 39],[53, 25],[53, 26],[53, 27],[53, 28],[53, 29],[53, 30],[27, 20],[27, 21],[28, 21],[28, 20],[48, 4],[48, 3],[48, 2],[51, 39],[51, 38]];
 
 
  
  for( let i=0; i<walls.length; i++){
    for(let z=0; z<document.getElementsByClassName("col" + walls[i][0]).length; z++){ 
      if( document.getElementsByClassName("col" + walls[i][0])[z].classList.contains("row" + walls[i][1]) ){
          document.getElementsByClassName("col" + walls[i][0])[z].classList.add("badCell"); 
        }
    }
  } 
  for( let i=0; i<startGrowth.length; i++){
    for(let z=0; z<document.getElementsByClassName("col" +  startGrowth[i][0]).length; z++){ 
      if( document.getElementsByClassName("col" +  startGrowth[i][0])[z].classList.contains("row" + startGrowth[i][1]) ){
          document.getElementsByClassName("col" +  startGrowth[i][0])[z].classList.add("badCell"); 
          document.getElementsByClassName("col" +  startGrowth[i][0])[z].classList.add("growth"); 
        }
    }
  }
  ///////////////////////////////////////////////////
}

// Searches for target cells
function getCell(col, row){
  let cellCols = document.getElementsByClassName("col" + col);
  for(let i=0; i<cellCols.length; i++){
    if(cellCols[i].classList.contains("row" + row)){
      return(cellCols[i]);
    }
  }
} 
function setSnake(){
  for(let i=0; i<snakePos.length; i++){
    getCell(snakePos[i][0], snakePos[i][1]).classList.add("snake"); 
    if(i===0){
      getCell(snakePos[i][0], snakePos[i][1]).classList.add("snakeHead");  
    }
  }
}



///////SNAKE MOVE //////   

function moveSnake(){  
  let colPointer = "col" + snakePos[snakePos.length -1][0];
  let rowPointer = (snakePos[snakePos.length -1][1]) -1; 
  document.getElementsByClassName(colPointer)[rowPointer].classList.remove("snake");
  document.getElementsByClassName("snakeHead")[0].classList.remove("snakeHead");

  let newCol = snakePos[0][0] + dir[0]; 
  let newRow =snakePos[0][1] + dir[1];

  checkSnakeMove(newCol, newRow);

  snakePos.unshift([newCol, newRow]);
  snakePos.pop();  
  setSnake(); 
  addGrowth();
  if( changeActive ){ changeActive = false; }
}



function checkSnakeMove(col, row){
  let checkCol = document.getElementsByClassName("col" + col); 
  if(checkCol[row -1].classList.contains("badCell") || checkCol[row -1].classList.contains("snake")){
    endGame(); 
  }
  if(checkCol[row -1].classList.contains("item")){
    getItem();
  }
}

function endGame(){  
  clearInterval(startGame);  
  lazerActive = false;
  started = 0;
  prompt.style.display = "block";
}


//get item logic
function getItem(){
  document.getElementsByClassName("item")[0].classList.remove("item");
  updateScore(50);
  snakePos.push(snakePos[0]);
  setItem();
  speed = speed - speedIncr;
  clearInterval(startGame);
  startGame = setInterval( function(){moveSnake();}, speed);
}
function setItem(){
  let rn = Math.floor(Math.random() * columns) +1;
  let rnTwo = Math.floor(Math.random() * rows);
  let tryCol = document.getElementsByClassName("col" + rn);
  let tryCell = tryCol[ rnTwo ];
  if(tryCell.classList.contains("snake") || tryCell.classList.contains("badCell")){
    setItem();
  }else{
    tryCell.classList.add("item");
  }
}


//Lazers
function fireLazer(){ 
  let lazerStart = snakePos[0];
  let lazerDir = dir;
  let lazerPos = [lazerStart[0] + lazerDir[0],  lazerStart[1] + lazerDir[1] -1 ];
  function canShoot(){
    let ret = true;
    if(dir[0] === 1){
      if(snakePos[0][0] > columns -2){
        ret = false;
      }
    }
    if(dir[0] === -1){
      if(snakePos[0][0] < 2){
        ret = false;
      }
    }
    if(dir[1]=== 1){
      if(snakePos[0][1] > rows -2){
        ret = false;
      }
    }
    if(dir[1] === -1){
      if(snakePos[0][1] < 2){
        ret = false;
      }
    }
    return(ret);
  }  
  if( canShoot() ){
    
    let lazer = false;
    let startLazer = setInterval( function(){ 
      lazerPos = [lazerPos[0] + lazerDir[0],  lazerPos[1] + lazerDir[1] ];
      //If next lazer position is badCell (hit) then remove Lazer 
      if( document.getElementsByClassName("col" + lazerPos[0])[lazerPos[1]].classList.contains("badCell") ){
        //If next lazer position is growth (hit) then remove growth 
        if( document.getElementsByClassName("col" + lazerPos[0])[lazerPos[1]].classList.contains("growth") ){
          document.getElementsByClassName("col" + lazerPos[0])[lazerPos[1]].classList.remove("badCell");
          document.getElementsByClassName("col" + lazerPos[0])[lazerPos[1]].classList.remove("growth");
          updateScore(10); 
        }
        document.getElementsByClassName("lazer")[0].classList.remove("lazer");
        clearInterval(startLazer);
        lazerActive = false;
        lazer = false;
      }else{ //If lazer can move, then update lazer position
        if(lazer){ document.getElementsByClassName("lazer")[0].classList.remove("lazer"); }
        document.getElementsByClassName("col" + lazerPos[0])[lazerPos[1]].classList.add("lazer");
        lazer = true; 
      }  
    }, lazerSpeed); 
    
    }else{
      lazerActive = false;
    }
  
}

//growth
function addGrowth(){
  let growthChance = Math.floor(Math.random() * 100);
  if(growthChance > growthLevel){
    let growthLoc = [1,1];
    growthLoc[0] = snakePos[0][0] < (columns/2) ? Math.round(Math.random() * (columns - columns/2) + columns /2): Math.round(Math.random() * (columns /2 - 2) + 2);
    growthLoc[1] = snakePos[0][1] < (rows/2) ? Math.round(Math.random() * (rows - rows/2) + rows /2): Math.round(Math.random() * (rows /2 - 2) + 2); 
    let newGrowth = document.getElementsByClassName("col"+ growthLoc[0])[growthLoc[1] -1];
    if(!newGrowth.classList.contains("badCell") && !newGrowth.classList.contains("item")&& !newGrowth.classList.contains("snake")){
      newGrowth.classList.add("badCell");
      newGrowth.classList.add("growth");
    }
  } 
}

function restartGame(){ 

  snakePos = [
    [10, 10],
    [10, 9],
    [10, 8],
    [10, 7],
    [10, 6],
    [10, 5]
  ]; 
 
  setCanvas();
  setSnake(); 
  setItem();
  started = 1;
  curKey = 40;
  speed = startSpeed;
  updateScore(-gameScore);
}
function updateScore( toAdd ){
  gameScore = gameScore + toAdd;
  document.getElementById("score").innerHTML = gameScore;
  if(gameScore > highScore){
    highScore = gameScore
    document.getElementById("highscore").innerHTML = highScore;
  }
}

/*
 restartGame();
prompt.style.display = "none";
*/