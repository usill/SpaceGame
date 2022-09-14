
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
  startBG.style.display = 'flex';
  looseBlock.style.display = 'block';
  scoreInfoBlock.innerText = `Вы набрали ${this.score} очков`;
  this.clearState();
}

game.clearState = function() {
  this.score = 0;
  Lazer.lazerList = [];
  Asteroid.asteroidList = [];
  clearInterval(Lazer.lazerMove)
  clearInterval(Asteroid.asteroidMove, Asteroid.moveSpeed)
  clearInterval(Asteroid.asteroidSpawn, Asteroid.spawnFrequency)
  
}

const SpaceShip = {
  width: 64,
  height: 64,
  positionX: null,
  positionY: null,
  speed: 5,
}

SpaceShip.setPosition = function() {
  this.positionX = (game.canvasWidth - this.width) / 2;
  this.positionY = game.canvasHeight - this.height;
};

SpaceShip.setEvents = function() {
  this.setPosition();
  this.move();
  this.fire();
};

SpaceShip.move = function() {
  document.addEventListener('mousemove', (e) => {
    if(e.clientX < 600 - this.width / 2 &&
       e.clientX > 0 + this.width / 2) {
      this.positionX = e.clientX - this.width / 2;
    }
    
  })
};

SpaceShip.fire = function() {
  game.canvas.addEventListener('click', () => {
    Lazer.lazerList.push({ x: this.positionX, y: this.positionY });
    if(this.lazerMove) 
      clearInterval(this.lazerMove, 200)
    this.lazerMove = setInterval(() => {
      Lazer.lazerList.map((item) => {
        if(item.y < this.height) {
          Lazer.lazerList = Lazer.lazerList.filter(el => el !== item); // clear no visible items
        }
        Asteroid.asteroidList.map(asteroid => {
          if(asteroid.y + Asteroid.height > item.y && 
            asteroid.y < item.y + Lazer.height &&
            asteroid.x + Asteroid.width > item.x &&
            asteroid.x < item.x + Lazer.width) {

            Lazer.lazerList = Lazer.lazerList.filter(el => el !== item);
            Asteroid.asteroidList = Asteroid.asteroidList.filter(el => el !== asteroid);
            game.score += 50;
          }

          
        })
        
        item.y -= 10;
      })
      
    }, 20)

  })
}

const Lazer = {
  width: 16,
  height: 16,
  lazerList: [],
  lazerMove: null,
}

const Asteroid = {
  width: 64,
  height: 64,
  asteroidList: [],
  asteroidMove: null,
  asteroidSpawn: null,
  spawnFrequency: 500,
  moveSpeed: 40,
}



Asteroid.spawn = function() {
  let asteroid = {
    y: 0,
    x: Math.random() * game.canvasWidth,
  }
  this.asteroidList.push(asteroid);
}



const startBG = document.querySelector('.start');
const startButton = document.querySelector('.start__button');
const looseBlock = document.querySelector('.start__lose');
const scoreInfoBlock = document.querySelector('.start__subtitle')
startButton.addEventListener('click', () => {
  game.isGameStart = true;
  game.start();
  startBG.style.display = 'none';
  looseBlock.style.display = 'none';
})