import game from "./game.js"
import SpaceShip from "./SpaceShip.js";


const Storm = {
  width: 64,
  height: 64,
  stormList: [],
  isLeft: true,
  stormMoveInterval: null,
  stormFrequentlyInterval: null,
}

Storm.spawn = function() {
  this.stormFrequentlyInterval = setInterval(this.stormFrequentlyFunc.bind(this), 2000);
  this.stormMoveInterval = setInterval(this.stormMoveFunc.bind(this), 10);
}

Storm.stormFrequentlyFunc = function() {
  for(let i = 1; i < 8; i++) {
    let asteroid = { 
      x: this.isLeft ? (this.width * i) - this.width : game.canvasWidth - (this.width * i), 
      y: Math.random(game.canvasHeight / 2),
      isLeft: this.isLeft,
    }
    this.stormList.push(asteroid);
  }
  this.isLeft = !this.isLeft;
}

Storm.stormMoveFunc = function() {
  setTimeout(() => {
    this.stormList.map(item => {
      item.y += 5;

      if (
        SpaceShip.positionY + SpaceShip.height > item.y &&
        SpaceShip.positionY < item.y + this.height &&
        SpaceShip.positionX + SpaceShip.width > item.x &&
        SpaceShip.positionX < item.x + this.width
      ) {
        game.loose();
      }
    },)
  }, 2500)
}

export default Storm;