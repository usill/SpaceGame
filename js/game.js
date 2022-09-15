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
    one: 100, //500
    two: 200, //1250
    three: 300, //2250
    four: 400, //3500
    five: 500, // 5000
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
  },
};

game.start = function () {
  this.init();
  this.preload();
  Boss.shots = [];
  this.run();
};

game.init = function () {
  this.canvas = document.querySelector("#canvas");
  this.ctx = this.canvas.getContext("2d");
  SpaceShip.setEvents();
  Explode.trigger();
  this.createAsteroids();
  this.ctx.fillStyle = "#fff";
  this.ctx.font = "25px Vardana";
};

game.preload = function () {
  let loadedCount = 0;
  let required = Object.keys(this.sprites).length;
  for (let key in this.sprites) {
    this.sprites[key] = new Image();
    this.sprites[key].src = `img/${key}.png`;
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
  this.ctx.fillText(`Level: ${this.level}`, 500, 40);
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
    (this.score === this.levelsScore.one && Asteroid.moveSpeed === 40) ||
    (this.score === this.levelsScore.two && Asteroid.moveSpeed === 35) ||
    (this.score === this.levelsScore.three && Asteroid.moveSpeed === 30) ||
    (this.score === this.levelsScore.four && Asteroid.moveSpeed === 25)
  ) {
    clearInterval(Asteroid.asteroidMove);
    clearInterval(Asteroid.asteroidSpawn);
    Asteroid.moveSpeed -= 5;
    Asteroid.spawnFrequency -= 100;
    this.createAsteroids();
    this.level += 1;
  }
  else if(this.score === this.levelsScore.five && Asteroid.moveSpeed === 20 && !this.isFirstBossShow) {
    this.isFirstBossShow = true;
    clearInterval(Asteroid.asteroidSpawn);
    this.level += 1;
    setTimeout(() => {
      Boss.show();
      clearInterval(Asteroid.asteroidMove);
      this.boss = !this.boss
    }, 2000)
  }
};

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
  UIelements.startBG.style.display = "flex";
  UIelements.looseBlock.style.display = "block";
  UIelements.scoreInfoBlock.innerText = `Вы набрали ${this.score} очков`;
  this.clearState();
};

game.clearState = function () {
  this.score = 0;
  Asteroid.moveSpeed = 40;
  Asteroid.spawnFrequency = 500;
  Lazer.lazerList = [];
  Asteroid.asteroidList = [];
  this.boss = false;
  Boss.shots = [];
  clearInterval(Lazer.lazerMove);
  clearInterval(Asteroid.asteroidMove);
  clearInterval(Asteroid.asteroidSpawn);
  clearInterval(Explode.explodeInterval);

  this.level = 1;
  Explode.explodeInterval = null;
  Asteroid.moveSpeed = Asteroid.defaultMoveSpeed;
  Asteroid.spawnFrequency = Asteroid.defaultSpawnFrequency;
};

export default game;
