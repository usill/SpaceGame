import game from './game.js'
import Lazer from './Lazer.js';
import Explode from './Explode.js';

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
  game.canvas.onclick = this.fire.bind(this)
};

SpaceShip.move = function() {
  document.addEventListener('mousemove', (e) => {
    if(e.clientX < 600 - this.width / 2 &&
       e.clientX > 0 + this.width / 2) {
      this.positionX = e.clientX - this.width / 2;
    }
    
  })
};

SpaceShip.fire = function () {
    Lazer.lazerList.push({ x: this.positionX, y: this.positionY });
    if(Lazer.lazerMove) 
      clearInterval(Lazer.lazerMove, 200)
      
    Lazer.lazerMove = setInterval(() => {
      Lazer.lazerList.map((item) => {
        if(item.y < game.height) {
          
          Lazer.lazerList = Lazer.lazerList.filter(el => el !== item); // clear no visible items
        }
        // console.log(Lazer.lazerList)
        Explode.trigger(item);
        
        item.y -= 10;
      })
      
    }, 20)
}

export default SpaceShip;