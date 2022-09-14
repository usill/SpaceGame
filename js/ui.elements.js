import game from "./game.js";

const UIelements = {
  startBG: document.querySelector('.start'),
  startButton: document.querySelector('.start__button'),
  looseBlock: document.querySelector('.start__lose'),
  scoreInfoBlock: document.querySelector('.start__subtitle'),
}

UIelements.startButton.addEventListener('click', function() {
  game.isGameStart = true;
  game.start();
  UIelements.startBG.style.display = 'none';
  UIelements.looseBlock.style.display = 'none';
})

export default UIelements;