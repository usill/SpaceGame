import Boss from "./Boss.js";

const Lazer = {
  width: 16,
  height: 16,
  lazerList: [],
  damage: 2,
  lazerMove: null,
}

Lazer.shot = function() {
  Lazer.lazerList.map(item => {
    if (
      Boss.y + Boss.height > item.y &&
      Boss.y < item.y + this.height &&
      Boss.x + Boss.width > item.x &&
      Boss.x < item.x + this.width
    ) {
      this.lazerList = this.lazerList.filter(el => el !== item)
      Boss.health -= this.damage;
    }
  })
  
}

export default Lazer;