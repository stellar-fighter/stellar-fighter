import {Camera} from './camera';
import {Fighter001, Alien001, Bullet001} from './entities';
import {PosComp, SizeComp, MovComp, VisComp, CamOutComp, CollComp, HpComp, TeamComp, ShootingComp} from './comps';
import {MovSystem, CamOutSystem, CollSystem, HpSystem} from './systems';

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
    this.systems.push(new HpSystem({state: this}));
    this.systems.push(new CamOutSystem({state: this}));
    this.systems.push(new CollSystem({state: this}));
    this.player = new Fighter001({
      state: this,
      comps: {
        pos: new PosComp({x: 1500, y: 2000}),
        mov: new MovComp({velY: -15}),
        camOut: new CamOutComp({type: CamOutComp.BLOCK}),        
        shooting: new ShootingComp({coolTime:150}),
      }
    });
    this.entities.push(this.player);

    const that = this;
    this.handleKeyDown = (event) => {
      console.log(event.code);
      if(event.code == 'KeyP') {
        that.running = !that.running;
        return;
      }
      that.event[event.code] = true;
    };
    this.handleKeyUp = (event) => {
      that.event[event.code] = false;
    };
    addEventListener('keydown', this.handleKeyDown);
    addEventListener('keyup', this.handleKeyUp);
  }

  genEntity() {
    /*
    let entityData = this.level[this.levelEntityIndex];
    while(entityData && this.camera.y <= entityData.y) {
      switch(entityData.type) {
      case 'a-001':
        //this.entities.push(new Alien001({state: this}));
        break;
      case 's-fighter':
        this.entities.push(
          new Fighter001({
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
    */
    if(Math.random() > 0.99) {
      this.entities.push(
        new Fighter001({
          state: this,
          comps: {
            pos: new PosComp({x: Math.random() * ((this.canvas.width / this.camera.scale) + this.camera.x) , y: this.camera.y}),
            team: new TeamComp({value: 'enemy'})
          },
        })
      );
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
      if (this.player.comps['shooting'].enabled) {
        this.entities.push(
          new Bullet001({
            state: this,
            comps: {
              pos: new PosComp({x: this.player.comps['pos'].x, y: this.player.comps['pos'].y}),
            }
          })
        );
      }      
    }
    this.genEntity();
    for(let system of this.systems) {
      system.process();
    }
    this.camera.y -= 15;
  }

  render() {
    const ctx = this.ctx;
    const camera = this.camera;
    const canvas = this.canvas;
    const entities = this.entities;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(
      0,
      0,
      canvas.width / 2,
      canvas.height / 2
    );
    ctx.stroke();

    if(entities.length > 0) {
      for(let entity of entities) {
        const pos = entity.comps['pos'];
        const size = entity.comps['size'];
        const vis = entity.comps['vis'];
        const hp = entity.comps['hp'];
        ctx.save();
        ctx.setTransform(
          camera.scale, 0,
          0, camera.scale,
          //size.width / -2 * this.camera.scale, 0 
          0, 0
        );
        ctx.drawImage(
          vis.image,
          (pos.x - camera.x),
          (pos.y - camera.y),
          size.width,
          size.height
        );
        ctx.beginPath();
        ctx.rect(
          (pos.x - camera.x),
          (pos.y - camera.y),
          size.width,
          size.height
        );
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#00FF00';
        ctx.font = '' + (300 * camera.scale) + 'px Arial';
        ctx.fillText(
          hp.value,
          pos.x - camera.x,
          pos.y - camera.y
        );
        ctx.closePath();
        ctx.restore();
      }
    }
  }
  destroy() {
    removeEventListener('keydown', this.handleKeyDown);
    removeEventListener('keyup', this.handleKeyUp);
  }
}

export {State, PlayState};
