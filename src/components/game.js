import Asteroid from "./Asteroid.js";
import Lazer from "./Lazer.js";
import SpaceShip from "./SpaceShip.js";
import UIelements from "./ui.elements.js";
import Explode from "./Explode.js";
import Boss from "./Boss.js";

const game = {
  canvas: null,
  canvasWidth: canvas.offsetWidth,
  canvasHeight: canvas.offsetHeight,
  ctx: null,
  isGameStart: false,
  isFirstBossShow: false,
  boss: false,
  score: 0,
  level: 1,
  levelsScore: {
    one: 250,
    two: 500,
    three: 1000,
    four: 2000,
    five: 3500,
    six: 4000,
  },
  sprites: {
    background: null,
    ship: null,
    lazer: null,
    asteroid: null,
    explode: null,
    firstBoss: null,
    healthBar: null,
    bossProjectile: null,
    storm: null,
  },
};

game.start = function () {
  this.clearState();
  this.init();
  this.preload();
  this.run();
};

game.init = function () {
  this.canvas = document.querySelector("#canvas");
  this.ctx = this.canvas.getContext("2d");
  SpaceShip.setEvents();
  Explode.trigger();
  
  this.createAsteroids();
  this.ctx.fillStyle = "#fff";
  this.ctx.font = "32px VT323";
};

game.preload = function () {
  let loadedCount = 0;
  let required = Object.keys(this.sprites).length;
  for (let key in this.sprites) {
    this.sprites[key] = new Image();
    this.sprites[key].src = `images/${key}.png`;
    this.sprites[key].addEventListener("load", () => {
      loadedCount++;
      if (loadedCount >= required) {
        this.run();
      }
    });
  }
};

game.run = function () {
  window.requestAnimationFrame(() => {
    this.render();
    this.levelUp();
    if(this.boss) {
      Lazer.shot();
    }
    if (this.isGameStart) {
      this.run();
    }
    
    
  });
};

game.render = function () {
  
  this.ctx.drawImage(this.sprites.background, 0, 0);
  this.ctx.fillText(`Score: ${this.score}`, 20, 40);
  this.ctx.fillText(`Level: ${this.level}`, 475, 40);
  this.ctx.drawImage(
    this.sprites.ship,
    SpaceShip.positionX,
    SpaceShip.positionY
  );
  for (let explode in Explode.explodesList) {
    this.ctx.drawImage(
      this.sprites.explode,
      Explode.explodesList[explode].x,
      Explode.explodesList[explode].y
    );
  }
  for (let lazer in Lazer.lazerList) {
    this.ctx.drawImage(
      this.sprites.lazer,
      Lazer.lazerList[lazer].x + 24,
      Lazer.lazerList[lazer].y
    ); // draw lazers
  }

  for (let asteroid in Asteroid.asteroidList) {
    this.ctx.drawImage(
      this.sprites.asteroid,
      Asteroid.asteroidList[asteroid].x,
      Asteroid.asteroidList[asteroid].y
    );
  }

  if(this.boss) {
    this.ctx.drawImage(this.sprites.firstBoss, Boss.x, Boss.y);
    this.ctx.drawImage(this.sprites.healthBar, 0, 0, Boss.health, 9, Boss.x, Boss.y + Boss.height + 10, Boss.health, 9)
  }

  for(let shot in Boss.shots) {
    Boss.shots[shot].map(item => {
      this.ctx.drawImage(this.sprites.bossProjectile, 0, 0, 16, 19, item.x, item.y, 16, 19);
    })
  }
};

game.createAsteroids = function () {
  Asteroid.asteroidSpawn = setInterval(() => {
    Asteroid.spawn();
  }, Asteroid.spawnFrequency);

  Asteroid.asteroidMove = setInterval(
    this.setSpawnInterval,
    Asteroid.moveSpeed
  );
};

game.levelUp = function () {
  if (
    (this.score > this.levelsScore.one && this.score < this.levelsScore.two && Asteroid.moveSpeed === 40) ||
    (this.score > this.levelsScore.two && this.score < this.levelsScore.three && Asteroid.moveSpeed === 35) ||
    (this.score > this.levelsScore.three && this.score < this.levelsScore.four && Asteroid.moveSpeed === 30) ||
    (this.score > this.levelsScore.four && this.score < this.levelsScore.five && Asteroid.moveSpeed === 25)
  ) {
    this.nextLevel();
  }
  else if(this.score > this.levelsScore.five && this.score < this.levelsScore.six && Asteroid.moveSpeed === 20 && !this.isFirstBossShow) {
    Asteroid.moveSpeed = 40;
    Asteroid.spawnFrequency = 600;
    this.isFirstBossShow = true;
    clearInterval(Asteroid.asteroidSpawn);
    this.level += 1;
    setTimeout(() => {
      Boss.show();
      clearInterval(Asteroid.asteroidMove);
      this.boss = !this.boss;
    }, 2000)
  }
  
};

game.nextLevel = function() {
  clearInterval(Asteroid.asteroidMove);
  clearInterval(Asteroid.asteroidSpawn);
  Asteroid.moveSpeed -= 5;
  Asteroid.spawnFrequency -= 100;
  this.createAsteroids();
  this.level += 1;
}

game.setSpawnInterval = () => {
  Asteroid.asteroidList.map((item) => {
    item.y += 10;
    if (item.y > game.canvasHeight) {
      Asteroid.asteroidList = Asteroid.asteroidList.filter((el) => el !== item);
    }
    if (
      item.y + Asteroid.height > SpaceShip.positionY &&
      item.y < SpaceShip.positionY + SpaceShip.height &&
      item.x + Asteroid.width > SpaceShip.positionX &&
      item.x < SpaceShip.positionX + SpaceShip.width
    ) {
      game.loose();
    }
  });
};

game.loose = function () {
  Boss.clearIntervals();
  this.isGameStart = false;
  this.clearState();
  UIelements.showLooseDisplay();
  this.score = 0;
  console.log(1);
};

game.clearState = function () {
  Asteroid.moveSpeed = 40;
  Asteroid.spawnFrequency = 500;
  Lazer.lazerList = [];
  Asteroid.asteroidList = [];
  this.boss = false;
  Boss.health = 80;
  Boss.shots = [];
  clearInterval(Lazer.lazerMove);
  clearInterval(Asteroid.asteroidMove);
  clearInterval(Asteroid.asteroidSpawn);
  clearInterval(Explode.explodeInterval);
  this.isFirstBossShow = false;
  this.level = 1;
  Explode.explodeInterval = null;
  Asteroid.moveSpeed = Asteroid.defaultMoveSpeed;
  Asteroid.spawnFrequency = Asteroid.defaultSpawnFrequency;
  
};

export default game;
