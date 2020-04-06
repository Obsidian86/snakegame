let prompt = document.getElementById("prompt");
document.getElementsByClassName("startGame")[0].addEventListener("click", function(){
  prompt.style.display = "none";
  selectStage();
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

let snakePos = []

/// maps 
  const maps = [
    {
      name: 'Easy',
      walls: [],
      startGrowth: [],
      snakePos: [[29, 22],[29, 21],[29, 20],[29, 19],[29, 18],[29, 17]],
      growthLevel: 95
    },
    {
      growthLevel: 93,
      name: 'Medium',
      walls: [[21, 2],[21, 3],[21, 4],[21, 6],[21, 5],[21, 7],[21, 8],[21, 9],[20, 9],[20, 10],[19, 11],[20, 11],[19, 12],[19, 13],[18, 13],[17, 13],[16, 14],[16, 13],[2, 13],[3, 13],[3, 15],[3, 14],[4, 16],[3, 16],[5, 16],[6, 16],[7, 16],[21, 1],[15, 31],[15, 32],[15, 33],[15, 35],[15, 34],[15, 36],[16, 36],[18, 36],[17, 36],[20, 36],[21, 36],[22, 36],[23, 36],[24, 36],[19, 36],[24, 35],[24, 34],[25, 34],[26, 34],[28, 34],[29, 34],[27, 34],[31, 34],[30, 34],[31, 35],[31, 36],[31, 37],[31, 38],[31, 39],[2, 32],[3, 32],[4, 32],[5, 32],[6, 32],[6, 33],[6, 34],[6, 36],[6, 35],[59, 30],[58, 30],[57, 30],[55, 30],[56, 30],[54, 30],[54, 31],[53, 31],[53, 32],[52, 32],[52, 33],[52, 34],[51, 34],[50, 34],[49, 34],[56, 39],[56, 38],[56, 37],[56, 36],[52, 24],[53, 24],[53, 23],[53, 22],[53, 20],[53, 19],[53, 21],[53, 18],[53, 17],[53, 16],[53, 15],[53, 14],[53, 13],[53, 12],[53, 11],[53, 10],[53, 9],[54, 9],[54, 8],[54, 7],[54, 6],[54, 5],[53, 5],[52, 5],[51, 5],[50, 5],[49, 5],[48, 5],[46, 5],[45, 5],[47, 5],[44, 5],[43, 5],[42, 5],[42, 6],[42, 7],[31, 2],[31, 4],[31, 5],[31, 3],[31, 6],[31, 8],[31, 9],[31, 7],[31, 10],[31, 11],[32, 11],[34, 11],[35, 11],[33, 11],[37, 11],[38, 11],[39, 11],[40, 11],[36, 11],[25, 16],[24, 16],[23, 16],[30, 16],[31, 16],[32, 16],[32, 18],[32, 17],[23, 17],[23, 18],[23, 23],[23, 24],[23, 25],[24, 25],[25, 25],[32, 23],[32, 24],[32, 25],[31, 25],[30, 25],[2, 25],[4, 25],[5, 25],[3, 25],[7, 25],[6, 25],[7, 24],[7, 23],[41, 22],[41, 23],[41, 24],[41, 25],[41, 26],[41, 28],[41, 29],[41, 30],[41, 27],[40, 26],[42, 26],[43, 26],[39, 26]],
      startGrowth: [[24, 37],[24, 38],[24, 39],[53, 25],[53, 26],[53, 27],[53, 28],[53, 29],[53, 30],[27, 20],[27, 21],[28, 21],[28, 20],[48, 4],[48, 3],[48, 2],[51, 39],[51, 38]],
      snakePos:[[10, 10], [10, 9], [10, 8], [10, 7], [10, 6], [10, 5]]
    },
    {
      name: 'Difficult',
      walls: [ [50, 39],[50, 38],[50, 37],[50, 36],[51, 36],[51, 35],[52, 35],[53, 35],[53, 34],[57, 31],[57, 32],[56, 32],[55, 32],[55, 33],[54, 33],[10, 10],[59, 27],[58, 27],[57, 27],[57, 26],[57, 25],[57, 24],[55, 25],[55, 27],[55, 28],[55, 26],[55, 29],[55, 30],[55, 31],[9, 5],[9, 4],[11, 4],[11, 5],[11, 7],[11, 8],[11, 6],[58, 21],[57, 21],[56, 21],[55, 21],[54, 21],[53, 21],[52, 21],[54, 19],[53, 19],[51, 19],[50, 19],[48, 19],[48, 18],[48, 17],[47, 20],[46, 20],[44, 20],[45, 20],[53, 17],[53, 18],[53, 16],[52, 16],[12, 7],[13, 7],[14, 7],[15, 7],[12, 17],[12, 18],[12, 19],[12, 20],[12, 22],[12, 23],[12, 24],[12, 25],[12, 28],[12, 26],[12, 27],[12, 21],[12, 29],[12, 30],[12, 31],[12, 32],[12, 34],[12, 35],[12, 33],[14, 10],[14, 11],[14, 12],[14, 13],[14, 14],[14, 15],[14, 17],[14, 16],[14, 18],[14, 19],[14, 20],[16, 18],[16, 19],[16, 21],[16, 22],[16, 23],[16, 24],[16, 25],[16, 26],[17, 21],[18, 21],[19, 21],[20, 21],[17, 19],[18, 19],[19, 19],[16, 17],[16, 16],[15, 16],[16, 7],[17, 7],[18, 7],[19, 7],[20, 7],[20, 8],[20, 9],[20, 10],[20, 11],[20, 12],[19, 12],[18, 12],[17, 12],[17, 11],[17, 10],[16, 10],[15, 10],[19, 16],[19, 17],[19, 18],[12, 4],[13, 4],[14, 4],[15, 4],[16, 4],[17, 4],[17, 3],[17, 2],[15, 17],[15, 18],[15, 19],[8, 5],[7, 5],[6, 5],[5, 5],[4, 5],[4, 6],[4, 7],[4, 8],[4, 9],[4, 10],[4, 11],[12, 36],[12, 37],[12, 38],[16, 27],[16, 28],[16, 29],[16, 31],[16, 32],[16, 30],[16, 33],[16, 34],[16, 35],[16, 36],[16, 37],[16, 38],[16, 39],[11, 38],[10, 38],[9, 38],[9, 37],[9, 36],[9, 35],[9, 34],[8, 34],[7, 34],[6, 34],[6, 35],[6, 39],[5, 39],[47, 17],[46, 17],[45, 17],[44, 16],[44, 15],[44, 14],[10, 14],[10, 15],[10, 16],[10, 17],[10, 18],[10, 20],[10, 19],[11, 28],[10, 28],[9, 28],[7, 28],[6, 28],[5, 28],[4, 28],[11, 17],[9, 8],[8, 8],[8, 9],[8, 10],[8, 11],[8, 12],[8, 13],[8, 14],[9, 14],[10, 4],[13, 20],[13, 19],[13, 18],[13, 17],[15, 27],[13, 30],[15, 33],[13, 37],[8, 29],[8, 28],[8, 30],[2, 22],[3, 22],[4, 22],[6, 22],[7, 22],[5, 22],[7, 23],[20, 16],[21, 16],[22, 16],[23, 16],[23, 15],[23, 14],[23, 13],[23, 12],[23, 11],[23, 10],[23, 9],[24, 9],[24, 8],[24, 7],[24, 6],[25, 6],[26, 6],[27, 6],[28, 6],[29, 6],[24, 5],[27, 2],[29, 5],[31, 2],[29, 7],[30, 7],[32, 7],[31, 7],[33, 7],[33, 6],[33, 5],[34, 5],[35, 5],[36, 5],[20, 4],[21, 4],[48, 21],[48, 22],[48, 23],[48, 24],[49, 24],[50, 24],[51, 24],[52, 24],[53, 24],[54, 24],[48, 20],[44, 17],[52, 15],[52, 14],[51, 14],[50, 14],[49, 14],[48, 14],[44, 13],[45, 13],[48, 13],[48, 12],[44, 12],[44, 11],[44, 10],[44, 9],[48, 11],[48, 10],[48, 9],[47, 10],[44, 8],[45, 8],[48, 8],[48, 7],[48, 6],[47, 6],[51, 2],[52, 3],[51, 4],[51, 3],[52, 4],[52, 5],[51, 5],[53, 5],[54, 5],[55, 5],[56, 5],[55, 4],[52, 2],[56, 6],[55, 6],[57, 6],[59, 14],[58, 14],[57, 14],[56, 14],[55, 14],[59, 17],[58, 17],[57, 17],[57, 20],[56, 31],[26, 20],[25, 22],[26, 24],[26, 26],[35, 28],[40, 32],[38, 21],[34, 18],[32, 22],[30, 31],[26, 35],[34, 36],[43, 36],[45, 29],[43, 23],[40, 11],[35, 11],[29, 10],[30, 14],[38, 6],[42, 4],[46, 3],[34, 14],[30, 18],[40, 17],[38, 14],[20, 31],[21, 27],[21, 36],[30, 37],[35, 32],[30, 26],[38, 24],[41, 27],[50, 27],[51, 31],[53, 28],[47, 35],[38, 37],[24, 39],[24, 38],[24, 37],[38, 39],[38, 38],[30, 27],[31, 28],[30, 28],[33, 18],[32, 18],[31, 18],[42, 5],[41, 5],[39, 5],[40, 5],[37, 21],[36, 21],[35, 21],[35, 22],[34, 22],[33, 22],[4, 17],[5, 17],[6, 17],[5, 16],[5, 18],[4, 21],[2, 33],[3, 33],[30, 19],[23, 37],[22, 37],[29, 31],[28, 31],[27, 31],[28, 32],[28, 30],[20, 22],[20, 23],[54, 37],[55, 37],[56, 37],[20, 30],[20, 29]],
      startGrowth: [[56, 24],[56, 23],[3, 11],[2, 11],[3, 5],[2, 5],[5, 38],[5, 37],[5, 36],[10, 34],[11, 34],[11, 35],[10, 35],[6, 11],[5, 11],[7, 11],[32, 20],[32, 19],[32, 21],[26, 21],[34, 2],[34, 3],[34, 4],[48, 3],[49, 3],[50, 3],[50, 4],[49, 4],[48, 4],[48, 5],[49, 5],[58, 6],[59, 6],[45, 10],[46, 10],[46, 9],[46, 8],[46, 7],[35, 29],[35, 30],[35, 31],[38, 7],[38, 8],[38, 9],[38, 10],[39, 10],[40, 10],[44, 29],[43, 29],[50, 26],[50, 25],[50, 30],[50, 29],[50, 28],[52, 31],[53, 31],[30, 32],[43, 24],[43, 25],[43, 26],[44, 22],[44, 21],[35, 12],[35, 13],[29, 11],[29, 12],[29, 13],[21, 12],[22, 12],[17, 6],[17, 5],[13, 3],[13, 2],[20, 36],[19, 36],[18, 36],[17, 36],[19, 25],[18, 25],[17, 25],[19, 26],[18, 26],[17, 26],[36, 30],[37, 30],[38, 30],[38, 29],[38, 28],[39, 28],[40, 28],[41, 28],[43, 35],[44, 35],[45, 35],[46, 35],[48, 37],[49, 37],[39, 37],[40, 37],[40, 36],[39, 36]],
      snakePos: [[58, 38],[58, 37]],
      growthLevel: 60
    },
    
  ]

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

function setCanvas(walls, startGrowth){
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
  document.getElementById('snakeCanvas').style.display = 'none'
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

function restartGame(walls, startGrowth){ 
  document.getElementById('snakeCanvas').style.display = 'flex'
  setCanvas(walls, startGrowth);
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

function selectStage(){
  document.getElementsByClassName('selectStage')[0].innerHTML = ''
  document.getElementsByClassName('selectStage')[0].style.display = 'block'
  let selectMap = document.createElement('ul')
  maps.forEach(item => {
    let i = document.createElement('li')
    let p = document.createElement('p')
    let t = document.createTextNode(item.name)
    p.appendChild(t)
    i.appendChild(p)
    selectMap.appendChild(i)
    i.addEventListener('click', () => {
      snakePos = [...item.snakePos]
      growthLevel = item.growthLevel
      document.getElementsByClassName('selectStage')[0].style.display = 'none'
      restartGame(item.walls, item.startGrowth)
    })
  })
  document.getElementsByClassName('selectStage')[0].appendChild(selectMap)
}