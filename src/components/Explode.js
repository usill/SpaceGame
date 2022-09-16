import Asteroid from "./Asteroid.js";
import Lazer from "./Lazer.js";
import game from "./game.js";
const Explode = {
  explodesList: [],
  explodeFunc: null,
  explodeInterval: null,
  explodeTime: 100,
};

Explode.trigger = function (item) {
  Asteroid.asteroidList.map((asteroid) => {
    if (
      asteroid.y + Asteroid.height > item.y &&
      asteroid.y < item.y + Lazer.height &&
      asteroid.x + Asteroid.width > item.x &&
      asteroid.x < item.x + Lazer.width
    ) {
      this.explodesList.push({ x: asteroid.x, y: asteroid.y });
      if (!this.explodeInterval) {
        this.explodeInterval = setInterval(this.explodeFunc.bind(this), this.explodeTime);
      }
      Lazer.lazerList = Lazer.lazerList.filter((el) => el !== item);
      Asteroid.asteroidList = Asteroid.asteroidList.filter(
        (el) => el !== asteroid
      );
      game.score += 25;
      game.explodeCount += 1;
    }
  });
};

Explode.explodeFunc = function() {
    this.explodesList = this.explodesList.filter(item => item !== this.explodesList[0]);
}

export default Explode;
