import Asteroid from "./Asteroid.js";
import Lazer from "./Lazer.js";
import SpaceShip from "./SpaceShip.js"
import UIelements from "./ui.elements.js";
import Explode from "./Explode.js";

const game = {
  canvas: null,
  canvasWidth: canvas.offsetWidth,
  canvasHeight: canvas.offsetHeight,
  ctx: null,
  isGameStart: false,
  score: 0,
  KEYS: {
    left: 65,
    right: 68,
  },
  sprites: {
    background: null,
    ship: null,
    lazer: null,
    asteroid: null,
    explode: null,
  }
};

game.start = function() {
  this.init();
  this.preload();
  this.run();
}

game.init = function() {
  this.canvas = document.querySelector('#canvas')
  this.ctx = this.canvas.getContext('2d');
  SpaceShip.setEvents();
  Explode.trigger();
  this.createAsteroids();
  this.ctx.fillStyle = "#fff";
  this.ctx.font = "25px Vardana";
}

game.preload = function() {
  let loadedCount = 0;
  let required = Object.keys(this.sprites).length;
  for(let key in this.sprites) {
    this.sprites[key] = new Image();
    this.sprites[key].src = `img/${key}.png`;
    this.sprites[key].addEventListener('load', () => {
      loadedCount++;
      if(loadedCount >= required) {
        this.run();
      }
    })
  }
}

game.run = function() {
  window.requestAnimationFrame(() => {
    this.render();
    if(this.isGameStart) {
      this.run();
    }
    if(this.score === 500 && Asteroid.moveSpeed === 40 ||
      this.score === 1000 && Asteroid.moveSpeed === 35 ||
      this.score === 1500 && Asteroid.moveSpeed === 30 ||
      this.score === 2000 && Asteroid.moveSpeed === 25) {
      this.levelUp();
    }
  })
}

game.render = function() {
  this.ctx.drawImage(this.sprites.background, 0, 0);
  this.ctx.fillText(`Score: ${this.score}`, 20, 40);
  this.ctx.drawImage(this.sprites.ship, SpaceShip.positionX, SpaceShip.positionY);
  for(let explode in Explode.explodesList) {
    this.ctx.drawImage(this.sprites.explode, Explode.explodesList[explode].x, Explode.explodesList[explode].y)
  }
  for(let lazer in Lazer.lazerList) {
    this.ctx.drawImage(this.sprites.lazer, Lazer.lazerList[lazer].x + 24, Lazer.lazerList[lazer].y) // draw lazers
  }
  
  for(let asteroid in Asteroid.asteroidList) {
    this.ctx.drawImage(this.sprites.asteroid, Asteroid.asteroidList[asteroid].x, Asteroid.asteroidList[asteroid].y)
  }
  
}

game.createAsteroids = function() {
  Asteroid.asteroidSpawn = setInterval(() => { Asteroid.spawn(); }, Asteroid.spawnFrequency)
  
  Asteroid.asteroidMove = setInterval(this.setSpawnInterval, Asteroid.moveSpeed)
}

game.levelUp = function() {
  clearInterval(Asteroid.asteroidMove);
  clearInterval(Asteroid.asteroidSpawn);
  Asteroid.moveSpeed -= 5;
  Asteroid.spawnFrequency -= 100;
  Asteroid.asteroidSpawn = setInterval(() => { Asteroid.spawn() }, Asteroid.spawnFrequency)
  Asteroid.asteroidMove = setInterval(this.setSpawnInterval, Asteroid.moveSpeed)
}

game.setSpawnInterval = () => {
  Asteroid.asteroidList.map(item => {
    item.y += 10;
    if(item.y > game.canvasHeight) {
      Asteroid.asteroidList = Asteroid.asteroidList.filter(el => el !== item)
    }
    if(item.y + Asteroid.height > SpaceShip.positionY && 
      item.y < SpaceShip.positionY + SpaceShip.height &&
      item.x + Asteroid.width > SpaceShip.positionX &&
      item.x < SpaceShip.positionX + SpaceShip.width) {
        game.loose();
      }
  })
}

game.loose = function() {
  this.isGameStart = false;
  UIelements.startBG.style.display = 'flex';
  UIelements.looseBlock.style.display = 'block';
  UIelements.scoreInfoBlock.innerText = `Вы набрали ${this.score} очков`;
  this.clearState();
}

game.clearState = function() {
  this.score = 0;
  Lazer.lazerList = [];
  Asteroid.asteroidList = [];
  if(Lazer.lazerMove && Asteroid.asteroidMove && Asteroid.asteroidSpawn && Explode.explodeFunc) {
    clearInterval(Lazer.lazerMove)
    clearInterval(Asteroid.asteroidMove)
    clearInterval(Asteroid.asteroidSpawn)
    clearInterval(Explode.explodeInterval)
  }

  
  Explode.explodeInterval = null;
  Asteroid.moveSpeed = Asteroid.defaultMoveSpeed;
  Asteroid.spawnFrequency = Asteroid.defaultSpawnFrequency;
}




export default game;