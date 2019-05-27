import {Camera} from './camera';
import {EntityMan, Fighter001, Alien001, Bullet001, Alien002, Item001} from './entities';
import {PosComp, SizeComp, MovComp, VisComp, CamOutComp, CollComp, HpComp, TeamComp, ShootingComp} from './comps';
import {MovSystem, CamOutSystem, CollSystem, HpSystem, ShootingSystem, PlayerSystem} from './systems';
import {Vec} from './vec';
import {Timer} from './timer';
import {SceneNode, Sprite, Background} from './scene_nodes';

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
    this.scene = new SceneNode({
      canvas: this.canvas,
      ctx: this.ctx,
      camera: this.camera
    });
    this.scene.addChild(new SceneNode({}));
    this.scene.addChild(new SceneNode({}));
    this.scene.addChild(new SceneNode({}));
    this.systems.push(new MovSystem({state: this}));
    this.systems.push(new HpSystem({state: this}));
    this.systems.push(new CamOutSystem({state: this}));
    this.systems.push(new CollSystem({state: this}));
    this.systems.push(new ShootingSystem({state: this}));
    this.systems.push(new PlayerSystem({state: this}));
    this.scene.children[0].addChild(new Background({texture: this.game.assetMan.images.bg010}));
    const player = new Fighter001({
      state: this,
      comps: {
        pos: new PosComp({vec: new Vec(1500, 2000)}),
        mov: new MovComp({vel: new Vec(0, -15)}),
        shooting: new ShootingComp({coolTime: 100, timer: this.timer, power: new Vec(0, -15), sound: this.game.assetMan.audios.shoot001})
      }
    });
    this.scene.children[2].addChild(player.comps['vis'].sn);
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
    if(Math.random() > 0.99) {
      const alien001 = new Alien001({
        state: this,
        comps: {
          pos: new PosComp({
            vec: new Vec(
              Math.random() * ((this.canvas.width / this.camera.scale) + this.camera.pos.x),
              this.camera.pos.y
            )
          }),
        },
      });
      this.entityMan.add(alien001);
      this.scene.children[1].addChild(alien001.comps['vis'].sn);
    }

    if(Math.random() > 0.999) {
      const item001 = new Item001({
        state: this,
        comps: {
          pos: new PosComp({
            vec: new Vec(
              Math.random() * ((this.canvas.width / this.camera.scale) + this.camera.pos.x),
              this.camera.pos.y
            )
          }),
          team: new TeamComp({val: 'ENEMY'}),
        },
      });
      this.entityMan.add(item001);
      this.scene.children[1].addChild(item001.comps['vis'].sn);
    }

    if(Math.random() > 0.997) {
      const alien002 = new Alien002({
        state: this,
        comps: {
          pos: new PosComp({
            vec: new Vec(
              Math.random() * ((this.canvas.width / this.camera.scale) + this.camera.pos.x),
              this.camera.pos.y
            )
          }),
        },
      });
      this.entityMan.add(alien002);
      this.scene.children[1].addChild(alien002.comps['vis'].sn);
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
    for(let system of this.systems)
      system.process();
    this.camera.pos.y -= 15;
  }

  render() {
    const {canvas, ctx, camera, scene} = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    scene.renderAll({canvas, ctx, camera});
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
    const score = 22; //example score
    var ranking = JSON.parse(localStorage.getItem("rankings"));
    if (ranking == null) {
      ranking = [];
    }
    console.log(ranking);
    ranking.push(score);
    ranking.sort(function(a, b) {
      return b - a;
    });
    localStorage.setItem("rankings", JSON.stringify(ranking));
    console.log(ranking);
  }
  update() {
    if(this.running == false)
      return;
  }
  render() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const camera = this.camera;
    var ranking = JSON.parse(localStorage.getItem("rankings"));
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
