/*eslint-env node*/
import './main.scss';
import {Game} from './game';
import {State, PlayState} from './states';

function main() {
  let started = false;
  const canvas = document.getElementById('main-canvas');

  const game = new Game();

  const level = [{x: 0, y: -1000, type: 's-fighter'}, {x: 1000, y: -2000, type: 's-fighter', player: true}];
  level.sort((a, b) => {
    return b.y - a.y;
  });

  function step(timeStamp) {
    game.setTime(timeStamp);
    game.update();
    game.render();
    requestAnimationFrame(step);
  }

  function resizeCanvas() {
    canvas.width = 3;
    canvas.height = 4;
    if(canvas.height / canvas.width >= window.innerHeight / window.innerWidth) {
      const newHeight = window.innerHeight;
      canvas.width = newHeight * canvas.width / canvas.height;
      canvas.height = newHeight;
    } else {
      const newWidth = window.innerWidth;
      canvas.height = newWidth * canvas.height / canvas.width;
      canvas.width = newWidth;
    }
    if(started == false) {
      started = true;
      game.pushState(new PlayState({game, running: true, canvas, level}));
      requestAnimationFrame(step);
    }
  }
  addEventListener("resize", resizeCanvas);
  addEventListener("load", resizeCanvas);

}

main();
