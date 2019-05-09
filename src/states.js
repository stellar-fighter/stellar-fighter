import {Camera} from './camera';
import {StellarFighter, A001} from './entities';
import {PosComp, MovComp} from './comps';
import {MovSystem} from './systems';

class State {
  constructor({game, running, systems, entities}) {
    this.game = game;
    this.running = running || false;
    this.systems = systems || [];
    this.entities = entities || [];
    this.startTime = null;
    this.curTime = null;
    this.deltaTime = null;
  }
  setTime(timeStamp) {
    if(this.startTime === null)
      this.startTime = timeStamp;
    if(this.curTime != null)
      this.deltaTime = timeStamp - this.curTime;
    this.curTime = this.timeStamp;
  }
  update() { throw new Error('AbstractMethod'); }
  render() { throw new Error('AbstractMethod'); }
  destroy() { throw new Error('AbstractMethod'); }
}

class PlayState extends State {
  constructor({game, running, systems, entities, canvas, level}) {
    super({game, running, systems, entities});
    this.event = {up: false, down: false, left: false, right: false};
    this.canvas = canvas;
    this.camera = new Camera({canvas, x: 0, y: 0});
    this.ctx = canvas.getContext('2d');
    this.level = level;
    this.levelEntityIndex = 0;
    this.systems.push(new MovSystem({state: this}));
    this.player = new StellarFighter({
      state: this,
      comps: {
        pos: new PosComp({x: 1000, y: 2500}),
        mov: new MovComp({velY: -15})
      }
    });
    this.entities.push(this.player);

    const that = this;
    this.handleKeyDown = function(event) {
      switch(event.code) {
      case 'ArrowUp':
        that.event.up = true;
        break;
      case 'ArrowDown':
        that.event.down = true;
        break;
      case 'ArrowLeft':
        that.event.left = true;
        break;
      case 'ArrowRight':
        that.event.right = true;
        break;
      }
    };
    this.handleKeyUp = function(event) {
      switch(event.code) {
      case 'ArrowUp':
        that.event.up = false;
        break;
      case 'ArrowDown':
        that.event.down = false;
        break;
      case 'ArrowLeft':
        that.event.left = false;
        break;
      case 'ArrowRight':
        that.event.right = false;
        break;
      }
    };
    addEventListener('keydown', this.handleKeyDown);
    addEventListener('keyup', this.handleKeyUp);
  }

  genEntity() {
    let entityData = this.level[this.levelEntityIndex];
    while(entityData && this.camera.y <= entityData.y) {
      switch(entityData.type) {
      case 'a-001':
        //this.entities.push(new A001({state: this}));
        break;
      case 's-fighter':
        this.entities.push(
          new StellarFighter({
            state: this,
            comps: {
              pos: new PosComp({x: entityData.x, y: entityData.y})
            }
          })
        );
        break;
      }
      entityData = this.level[++this.levelEntityIndex];
    }
  }

  update() {
    if(this.running === false)
      return;
    const pos = this.player.comps['pos'];
    if(this.event.up)
      pos.y -= 30;
    if(this.event.down)
      pos.y += 30;
    if(this.event.left)
      pos.x -= 30;
    if(this.event.right)
      pos.x += 30;
    this.genEntity();
    for(let system of this.systems) {
      system.process();
    }
    this.camera.y -= 15;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    /*
    this.ctx.save();
    this.ctx.setTransform(1, 0, 1, 1, 1, 1);
    */
    if(this.entities.length > 0) {
      for(let entity of this.entities) {
        this.ctx.drawImage(
          entity.comps['vis'].image,
          (entity.comps['pos'].x - this.camera.x) * this.camera.scale,
          (entity.comps['pos'].y - this.camera.y) * this.camera.scale,
          entity.comps['size'].width * this.camera.scale,
          entity.comps['size'].height * this.camera.scale
        );
      }
    }
    /*
    this.ctx.restore();
    */
  }
  destroy() {
    removeEventListener('keydown', this.handleKeyDown);
    removeEventListener('keyup', this.handleKeyUp);
  }
}

export {State, PlayState};
