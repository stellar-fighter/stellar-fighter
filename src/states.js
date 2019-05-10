import {Camera} from './camera';
import {StellarFighter, A001} from './entities';
import {PosComp, SizeComp, MovComp, VisComp, CamOutComp} from './comps';
import {MovSystem, CamOutSystem} from './systems';

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
    this.systems.push(new CamOutSystem({state: this}));
    this.player = new StellarFighter({
      state: this,
      comps: {
        pos: new PosComp({x: 1500, y: 2000}),
        mov: new MovComp({velY: -15}),
        camOut: new CamOutComp({type: CamOutComp.BLOCK})
      }
    });
    this.entities.push(this.player);

    const that = this;
    this.handleKeyDown = function(event) {
      console.log(event.code);
      if(event.code == 'KeyP') {
        that.running = !that.running;
        return;
      }
      that.event[event.code] = true;
    };
    this.handleKeyUp = function(event) {
      that.event[event.code] = false;
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
              pos: new PosComp({x: entityData.x, y: entityData.y}),
            }
          })
        );
        break;
      }
      entityData = this.level[++this.levelEntityIndex];
    }
  }

  update() {
    if(this.running == false)
      return;
    const pos = this.player.comps['pos'];
    if(this.event.ArrowUp)
      pos.y -= 30;
    if(this.event.ArrowDown)
      pos.y += 30;
    if(this.event.ArrowLeft)
      pos.x -= 30;
    if(this.event.ArrowRight)
      pos.x += 30;
    if(this.event.Space) {
      this.entities.push(
        new StellarFighter({
          state: this,
          comps: {
            size: new SizeComp({width: 100, height: 500}),
            pos: new PosComp({x: (this.player.comps['pos'].x)  , y: this.player.comps['pos'].y}),
            mov: new MovComp({velY: -30}),
            vis: new VisComp({image: this.game.assets.fire})
          }
        })
      );
    }
    this.genEntity();
    for(let system of this.systems) {
      system.process();
    }
    this.camera.y -= 15;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
    this.ctx.rect(
      0,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.ctx.stroke();

    /*
       */
    if(this.entities.length > 0) {
      for(let entity of this.entities) {
        let pos = entity.comps['pos'];
        let size = entity.comps['size'];
        let vis = entity.comps['vis'];
        this.ctx.save();
        this.ctx.setTransform(
          this.camera.scale, 0,
          0, this.camera.scale,
          //size.width / -2 * this.camera.scale, 0 
          0, 0
        );
        this.ctx.drawImage(
          vis.image,
          (pos.x - this.camera.x),
          (pos.y - this.camera.y),
          size.width,
          size.height
        );
        this.ctx.beginPath();
        this.ctx.rect(
          (pos.x - this.camera.x),
          (pos.y - this.camera.y),
          size.width,
          size.height
        );
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.rect(
          (pos.x - this.camera.x),
          (pos.y - this.camera.y),
          10,
          10
        );
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
      }
    }
  }
  destroy() {
    removeEventListener('keydown', this.handleKeyDown);
    removeEventListener('keyup', this.handleKeyUp);
  }
}

export {State, PlayState};
