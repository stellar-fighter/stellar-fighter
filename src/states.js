import {Camera} from './camera';
import {StellarFighter, A001} from './entities';
import {PosComp} from './comps';

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
    this.event = null;
    const that = this;
    this.handleKeyDown = function(event) {
      that.event = event;
    };
    this.canvas = canvas;
    this.camera = new Camera({canvas, x: 0, y: 0});
    this.ctx = canvas.getContext('2d');
    this.level = level;
    this.levelEntityIndex = 0;
    addEventListener('keydown', this.handleKeyDown);
  }
  update() {
    if(this.running === false) {
      this.event = null;
      return;
    }
    if(this.event) {
      /*
      if(this.event.code == 'ArrowUp')
        this.camera.y -= 100;
      */
    }
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
    this.camera.y -= 15;
    this.event = null;
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    /*
    this.ctx.save();
    this.ctx.setTransform(1, 0, 1, 1, 1, 1);
    */
    if(this.entities.length > 0) {
      for(let entity of this.entities) {
        console.log(entity);
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
  }
}

export {State, PlayState};
