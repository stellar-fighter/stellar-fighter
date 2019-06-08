import './main.scss';
import {Game} from './game';
import {State, PlayState} from './states';
import $ from 'jquery';
import 'jquery-modal/jquery.modal';
import jqery_modal_css from 'jquery-modal/jquery.modal.css';
import page from 'page';
/**
 * Set new game with new Game object
 */
function main() {
  const game = new Game();
  let animId = null;
  let canvas = null;
  let controls = null;
  let normalStart = false;
  /*
  const level = [{x: 0, y: -1000, type: 's-fighter'}, {x: 1000, y: -2000, type: 's-fighter', player: true}];
  level.sort((a, b) => {
    return b.y - a.y;
  });
  */

  function step(timeStamp) {
    if(animId) {
      game.setTime(timeStamp);
      game.update();
      game.render();
      animId = requestAnimationFrame(step);
    }
  }

  /**
   * Push new PlayState object to Game object
   */
  function play() {
    if(animId === null) {
      game.pushState(new PlayState({game, running: true, canvas}));
      animId = requestAnimationFrame(step);
    }
  }

  /**
   * Resize canvas funcion that will be called when resize event happens
   */
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
  }

  function unfocusElement() {
    document.activeElement.blur();
  }

  /**
   * Initialize by mapping source code to appropriate page
   */
  function init() {
    page('/main', (ctx, next) => {
      $('body').empty();
      $.get('./page/main.html', (res) => {
        $('body').html(res);
        $('#play-button').click((event) => page('/play'));
      });
      normalStart = true;
    });
    page('/play', (ctx, next) => {
      if(!normalStart) return;
      $('body').empty();
      $.get('./page/play.html', (res) => {
        $('body').html(res);
        $('#button-menu').click((event) => {
          game.state.running = false;
          event.preventDefault();
          this.blur();
          $('#button-menu-close').click((event) => {
            game.state.running = true;
            $.modal.close();
          });
          $('#button-to-main').click((event) => {
            event.preventDefault();
            this.blur();
            page("/main");
          });
          $('#menu').modal({
            escapeClose: false,
            clickClose: false,
            showClose: false
          });
        });
        addEventListener('resize', resizeCanvas);
        addEventListener('focus', unfocusElement);
        resizeCanvas();
        play();
      });
    });
    page.exit('/play', (ctx, next) => {
      cancelAnimationFrame(animId);
      animId = null;
      next();
    });
    // page('*', () => console.log('middleware'));
    page({hashbang: true});
    page.stop();
    page('/main');

  }
  addEventListener('load', init);
}

main();
