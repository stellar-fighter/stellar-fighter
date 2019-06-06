import './main.scss';
import {Game} from './game';
import {State, PlayState} from './states';
import $ from 'jquery';
import 'jquery-modal/jquery.modal';
import jqery_modal_css from 'jquery-modal/jquery.modal.css';
import page from 'page';

function main() {
  const game = new Game();
  let anim = null;
  let canvas = null;
  let controls = null;

  const level = [{x: 0, y: -1000, type: 's-fighter'}, {x: 1000, y: -2000, type: 's-fighter', player: true}];
  level.sort((a, b) => {
    return b.y - a.y;
  });

  function step(timeStamp) {
    game.setTime(timeStamp);
    game.update();
    game.render();
    anim = requestAnimationFrame(step);
  }

  function play() {
    if(anim === null) {
      game.pushState(new PlayState({game, running: true, canvas, level}));
      anim = requestAnimationFrame(step);
    }
  }

  function resizeCanvas() {
    canvas = document.getElementById('main-canvas');
    controls = document.getElementById('controls');
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
    $controls.css('width', canvas.width);
    play();
  }

  function init() {
    page('/start', () => {
      $('body').empty();
      $.get('./page/start.html', (res) => {
        $('body').html(res);
        $('#play-button').on('click', (event) => page('/play'));
      });
    });
    page('/play', () => {
      $('body').empty();
      $.get('./page/play.html', (res) => {
        $('body').html(res);
        $('#menu-button').click((event) => {
          event.preventDefault();
          this.blur();
          $('#menu').modal({
            escapeClose: true,
            clickClose: false,
            showClose: false
          });
        });
        addEventListener('resize', resizeCanvas);
        addEventListener('focus', (event) => document.activeElement.blur());
        resizeCanvas();
      });
    });
    page.exit('/play', () => {
      cancelAnimationFrame(anim);
      anim = null;
    });
    // page('*', () => console.log('middleware'));
    page({hashbang: true});
    page('/start');

  }
  addEventListener('load', init);
}

main();
