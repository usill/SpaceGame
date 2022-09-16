import game from "./game.js";

const Asteroid = {
  width: 64,
  height: 64,
  asteroidList: [],
  asteroidMove: null,
  asteroidSpawn: null,
  defaultMoveSpeed: 40,
  defaultSpawnFrequency: 500,
  spawnFrequency: 500,
  moveSpeed: 40,
}
Asteroid.spawn = function() {
  let asteroid = {
    y: 0,
    x: Math.random() * (game.canvasWidth - this.width),
  }
  this.asteroidList.push(asteroid);
}

export default Asteroid;