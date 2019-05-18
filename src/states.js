import {Camera} from './camera';
import {EntityMan, Fighter001, Alien001, Bullet001, Boss001, Hpitem} from './entities';
import {PosComp, SizeComp, MovComp, VisComp, CamOutComp, CollComp, HpComp, TeamComp, ShootingComp} from './comps';
import {MovSystem, CamOutSystem, CollSystem, HpSystem, ShootingSystem, PlayerSystem} from './systems';
import {Vec} from './vec';
import {Timer} from './timer';
import {SceneNode} from './scenes';

class State {
  constructor({game, running, systems, entityMan}) {
    if(game === undefined)
      throw new Error('RequiredParam');
    this.game = game;
    this.running = running || false;
    this.timer = new Timer();
    this.startTime = null;
    this.curTime = null;
    this.deltaTime = null;
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
    const player = new Fighter001({
      state: this,
      comps: {
        pos: new PosComp({vec: new Vec(1500, 2000)}),
        mov: new MovComp({vel: new Vec(0, -15)}),
        camOut: new CamOutComp({type: CamOutComp.BLOCK}),
        shooting: new ShootingComp({coolTime: 100, timer: this.timer}),
      }
    });
    this.playerId = this.entityMan.add(player);
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
    /*
    let entityData = this.level[this.levelEntityIndex];
    while(entityData && this.camera.pos.y <= entityData.y) {
      switch(entityData.type) {
      case 'a-001':
        //this.entityMan.add(new Alien001({state: this}));
        break;
      case 's-fighter':
        this.entityMan.add(
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
    if(Math.random() > 0.98) {
      this.entityMan.add(
        new Alien001({
          state: this,
          comps: {
            pos: new PosComp({
              vec: new Vec(
                Math.random() * ((this.canvas.width / this.camera.scale) + this.camera.pos.x),
                this.camera.pos.y
              )
            }),
            team: new TeamComp({val: 'ENEMY'}),
            shooting: new ShootingComp({enabled: true, coolTime: 5000, timer: this.timer})
          },
        })
      );
    }

    if(Math.random() > 0.997) {
      this.entityMan.add(
        new Hpitem({
          state: this,

          comps: {
            // pos: new PosComp({x: Math.random() * ((this.canvas.width / this.camera.scale) + this.camera.x), y: this.camera.y}),
            pos: new PosComp({
              vec: new Vec(

                Math.random() * ((this.canvas.width / this.camera.scale) + this.camera.pos.x),
                this.camera.pos.y
              )
            }),
            team: new TeamComp({val: 'ENEMY'}),
            shooting: new ShootingComp({enabled: true, coolTime: 5000, timer: this.timer})
          },
        })
      );
    }

    if(Math.random() > 0.997) {
      this.entityMan.add(
        new Boss001({
          state: this,
          comps: {
            pos: new PosComp({
              vec: new Vec(
                Math.random() * ((this.canvas.width / this.camera.scale) + this.camera.pos.x),
                this.camera.pos.y
              )
            }),
            team: new TeamComp({val: 'ENEMY'}),
            shooting: new ShootingComp({enabled: true, coolTime: 5000, timer: this.timer})
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
    const scene = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let index in this.entities) {
      const entity = this.entities[index];
      const vis = entity.comps['vis'];
      if(vis === undefined)
        continue;
      const layer = vis.sn.layer;
      if(scene[layer] === undefined)
        scene[layer] = [];
      scene[layer].push(vis.sn);
    }
    console.log(scene);
    for(let layer in scene) {
      for(let sn of scene[layer]) {
        ctx.save();
        ctx.setTransform(
          camera.scale, 0,
          0, camera.scale,
          0, 0
        );
        if(layer == 0)
          ctx.fillStyle = '#00FF00';
        if(layer == 1)
          ctx.fillStyle = '#FF0000';

        ctx.beginPath();
        ctx.rect(
          (sn.pos.x - camera.pos.x),
          (sn.pos.y - camera.pos.y),
          sn.size.x,
          sn.size.y
        );
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      }
      /*
      ctx.save();
      ctx.setTransform(
        camera.scale, 0,
        0, camera.scale,
        0, 0
      );
      ctx.drawImage(
        vis.image,
        (vis.sn.pos.x - camera.pos.x),
        (vis.sn.pos.y - camera.pos.y),
        vis.sn.size.x,
        vis.sn.size.y
      );
      ctx.beginPath();
      ctx.rect(
        (vis.sn.pos.x - camera.pos.x),
        (vis.sn.pos.y - camera.pos.y),
        vis.sn.size.x,
        vis.sn.size.y
      );
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = '#00FF00';
      ctx.font = '' + (300 * camera.scale) + 'px Arial';
      ctx.fillText(
        hp.val,
        vis.sn.pos.x - camera.pos.x,
        vis.sn.pos.y - camera.pos.y
      );
      ctx.closePath();
      ctx.restore();
      */
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
