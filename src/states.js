import {Camera} from './camera';
import {EntityMan, Fighter001, Alien001, Bullet001} from './entities';
import {PosComp, SizeComp, MovComp, VisComp, CamOutComp, CollComp, HpComp, TeamComp, ShootingComp} from './comps';
import {MovSystem, CamOutSystem, CollSystem, HpSystem, ShootingSystem, PlayerSystem} from './systems';
import {Vec} from './vec';
import {Timer} from './timer';

class State {
  constructor({game, running, systems, entityMan}) {
    this.game = game;
    this.running = running || false;
    this.timer = new Timer();
  }
  setTime(timeStamp) {
    this.timer.record(timeStamp);
  }
  update() { throw new Error('AbstractMethod'); }
  render() { throw new Error('AbstractMethod'); }
  destroy() { throw new Error('AbstractMethod'); }
}

class PlayState extends State {
  constructor({game, running, systems, entityMan, canvas, level}) {
    super({game, running});
    this.systems = systems || [];
    this.entityMan = entityMan || new EntityMan({});
    this.event = {up: false, down: false, left: false, right: false};
    this.canvas = canvas;
    this.camera = new Camera({canvas, pos: new Vec(0, 0)});
    this.ctx = canvas.getContext('2d');
    this.level = level;
    this.levelEntityIndex = 0;
    this.systems.push(new MovSystem({state: this}));
    this.systems.push(new HpSystem({state: this}));
    this.systems.push(new CamOutSystem({state: this}));
    this.systems.push(new CollSystem({state: this}));
    this.systems.push(new ShootingSystem({state: this}));
    this.systems.push(new PlayerSystem({state: this}));
    this.playerId = this.entityMan.add(
      new Fighter001({
        state: this,
        comps: {
          pos: new PosComp({vec: new Vec(1500, 2000)}),
          mov: new MovComp({vel: new Vec(0, -15)}),
          camOut: new CamOutComp({type: CamOutComp.BLOCK}),
          shooting: new ShootingComp({coolTime: 100, timer: this.timer}),
        }
      })
    );
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
  get entities() {
    return this.entityMan.entities;
  }
  set entities(entities) {
    this.entityMan.entities = entities;
  }
  genEntity() {
    if(Math.random() > 0.99) {
      this.entityMan.add(
        new Fighter001({
          state: this,
          comps: {
            pos: new PosComp({
              vec: new Vec(
                Math.random() * ((this.canvas.width / this.camera.scale) + this.camera.pos.x),
                this.camera.pos.y
              )
            }),
            team: new TeamComp({val: 'ENEMY'}),
            shooting: new ShootingComp({enabled: true, coolTime: 3000, timer: this.timer})
          },
        })
      );
    }
  }

  update() {
    if(this.running == false)
      return;
    const player = this.entityMan.get(this.playerId);
    if(!player) {
      this.game.switchState(new GameOverState({game: this.game, running: true, canvas: this.canvas, camera: this.camera}));
      return;
    }
    const shooting = player.comps['shooting'];
    if(this.event.Space)
      shooting.enabled = true;
    else
      shooting.enabled = false;
    this.genEntity();
    for(let system of this.systems) {
      system.process();
    }
    this.camera.pos.y -= 15;
  }

  render() {
    const ctx = this.ctx;
    const camera = this.camera;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let entity of Object.values(this.entities)) {
      const pos = entity.comps['pos'];
      const size = entity.comps['size'];
      const vis = entity.comps['vis'];
      const hp = entity.comps['hp'];
      ctx.save();
      ctx.setTransform(
        camera.scale, 0,
        0, camera.scale,
        0, 0
      );
      ctx.drawImage(
        vis.image,
        (pos.vec.x - camera.pos.x),
        (pos.vec.y - camera.pos.y),
        size.vec.x,
        size.vec.y
      );
      ctx.beginPath();
      ctx.rect(
        (pos.vec.x - camera.pos.x),
        (pos.vec.y - camera.pos.y),
        size.vec.x,
        size.vec.y
      );
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = '#00FF00';
      ctx.font = '' + (300 * camera.scale) + 'px Arial';
      ctx.fillText(
        hp.val,
        pos.vec.x - camera.pos.x,
        pos.vec.y - camera.pos.y
      );
      ctx.closePath();
      ctx.restore();
    }
  }
  destroy() {
    removeEventListener('keydown', this.handleKeyDown);
    removeEventListener('keyup', this.handleKeyUp);
  }
}

class GameOverState extends State {
  constructor({game, running, canvas, camera}) {
    super({game, running});
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = new Camera({canvas, pos: new Vec(0, 0)});
  }
  update() {
    if(this.running == false)
      return;
  }
  render() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const camera = this.camera;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = '#00FF00';
    ctx.font = '' + (300 * camera.scale) + 'px Arial';
    ctx.fillText(
      'GAME OVER',
      600 * camera.scale,
      2000 * camera.scale
    );
    ctx.closePath();
    ctx.restore();
  }
  destroy() {}
}

export {State, PlayState};
