import './main.scss';
import {Game} from './game';
import {State, PlayState} from './states';
import $ from 'jquery';
import 'jquery-modal/jquery.modal';
import jqery_modal_css from 'jquery-modal/jquery.modal.css';


function main() {
  let started = false;
  const controls = document.getElementById('controls');
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
    canvas.width = 9;
    canvas.height = 16 * 0.95;
    if(canvas.height / canvas.width >= window.innerHeight / window.innerWidth) {
      const newHeight = window.innerHeight * 0.95;
      canvas.width = newHeight * canvas.width / canvas.height;
      canvas.height = newHeight;
    } else {
      const newWidth = window.innerWidth;
      canvas.height = newWidth * canvas.height / canvas.width;
      canvas.width = newWidth;
    }
    const $canvas = $(canvas);
    const $controls = $(controls);
    $controls.css('top', canvas.height);
    $controls.css('height', canvas.height * 0.05 / 0.95);
    $controls.css('left', $canvas.offset().left);
    $controls.css('width', canvas.width);

    if(started == false) {
      started = true;
      game.pushState(new PlayState({game, running: true, canvas, level}));
      requestAnimationFrame(step);
    }
  }

  function init() {
    $.get('./partial/menu.html', function(html) {
      $(html).appendTo('body');
    });

    $('#menu-button').click((event) => {
      event.preventDefault();
      this.blur();
      $('#menu').modal({
        escapeClose: false,
        clickClose: false,
        showClose: false
      });
    });
    resizeCanvas();
  }

  addEventListener('resize', resizeCanvas);
  addEventListener('load', init);
  addEventListener('focus', (event) => document.activeElement.blur());
}

main();
