import game from "./game.js";
import SpaceShip from "./SpaceShip.js";
import Asteroid from "./Asteroid.js";
import Explode from "./Explode.js";

const Boss = {
  width: 80,
  height: 80,
  randomX: 0,
  randomY: 0,
  maxHealth: 80,
  health: 80,
  shots: [],
  moveInterval: null,
  shotSpeedInterval: null,
  shotFrequentlyInterval: null,
  projectSpeed: 10,
  projectFrequently: 500,
  x: 0,
  y: 0,
}

Boss.show = function() {
  this.x = (game.canvasWidth / 2) - (this.width / 2);
  this.y = this.height;
  this.setRandomPosition();
  this.move();
  this.shot();
}

Boss.move = function() {
  this.moveInterval = setInterval(this.IntervalFunc.bind(this), 1)
}

Boss.IntervalFunc = function() {
  if(this.randomX > this.x && this.randomY > this.y) {
    this.x += 1;
    this.y += 1;
  } else if (this.randomX < this.x && this.randomY < this.y) {
    this.x -= 1;
    this.y -= 1;
  } else if (this.randomX < this.x && this.randomY > this.y) {
    this.x -= 1;
    this.y += 1;
  } else if (this.randomX > this.x && this.randomY < this.y) {
    this.x += 1;
    this.y -= 1;
  } else if (this.randomX < this.x && this.randomY < this.y) {
    this.x -= 1;
    this.y -= 1;
  } else if (this.randomX === this.x && this.randomY < this.y) {
    this.y -= 1;
  } else if (this.randomX < this.x && this.randomY === this.y) {
    this.x -= 1;
  } else if (this.randomX === this.x && this.randomY > this.y) {
    this.y += 1;
  } else if (this.randomX > this.x && this.randomY === this.y) {
    this.x += 1;
  } else if( this.randomX === this.x && this.randomY === this.y) {
    this.setRandomPosition();
  }
  if(this.health <= 0) {
    this.clearIntervals();
    this.shots = [];
    game.score += 500;
    setTimeout(() => {
      const interval = setInterval(() => {
        Boss.y += 5;
        if(Boss.y > game.canvasHeight + Boss.height) {
          game.boss = false;
          clearInterval(interval);
        }
      }, 5)
    }, 1500)
    
  }
},

Boss.clearIntervals = function() {
  clearInterval(this.moveInterval);
  clearInterval(this.shotFrequentlyInterval);
  clearInterval(this.shotSpeedInterval);
}

Boss.setRandomPosition = function() {
  this.randomX = Math.floor(Math.random() * (game.canvasWidth - this.width));
  this.randomY = Math.floor(Math.random() * ((game.canvasHeight / 2) - this.height));
}

Boss.shot = function() {
  this.shotFrequentlyInterval = setInterval(() => {
    this.shots.push([
      { x: Boss.x + Boss.width / 2, y: Boss.y + Boss.height + 20},
      { x: Boss.x + Boss.width / 2, y: Boss.y + Boss.height + 20},
      { x: Boss.x + Boss.width / 2, y: Boss.y + Boss.height + 20},
  ])
    
  }, this.projectFrequently);
  this.shotSpeedInterval = setInterval(() => {
    this.shots.map(item => {
      for(let i = 0; i < 3; i++) {
        if(i === 1) {
          item[i].y += 3;
        } else if(i === 2) {
          item[i].y += 3;
          item[i].x -= 2;
        } else {
          item[i].y += 3;
          item[i].x += 2;
        }
        if (
          SpaceShip.positionY + SpaceShip.height > item[i].y &&
          SpaceShip.positionY < item[i].y + 18 &&
          SpaceShip.positionX + SpaceShip.width > item[i].x &&
          SpaceShip.positionX < item[i].x + 16) {
            game.loose();
          }
        
      }
      
    })
  }, this.projectSpeed)
}

export default Boss;