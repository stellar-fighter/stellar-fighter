/*eslint-env node*/
import './main.scss';
import {Game} from './game';
import {State, PlayState} from './states';

function main() {
  const canvas = document.getElementById('main-canvas');
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
  }
  addEventListener("resize", resizeCanvas);
  addEventListener("load", resizeCanvas);

  const game = new Game();

  const level = [{x: 0, y: -1000, type: 's-fighter'}, {x: 1000, y: -2000, type: 's-fighter', player: true}];
  level.sort((a, b) => {
    return b.y - a.y;
  });

  let state = new PlayState({game, running: true, canvas, level});
  game.pushState(state);
  function step(timeStamp) {
    game.setTime(timeStamp);
    game.update();
    game.render();
    if(game.running)
      requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

main();
