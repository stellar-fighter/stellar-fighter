import {Camera} from './camera';
import {EntityMan, Fighter001, Alien001, Bullet001, Potion, Boss} from './entities';
import {PosComp, SizeComp, MovComp, VisComp, CamOutComp, CollComp, HpComp, TeamComp, ShootingComp} from './comps';
import {MovSystem, CamOutSystem, CollSystem, HpSystem} from './systems';

class State {
  constructor({game, running, systems, entityMan}) {
    this.game = game;
    this.running = running || false;
    this.systems = systems || [];
    this.entityMan = entityMan || new EntityMan({});
    this.startTime = null;
    this.curTime = null;
    this.deltaTime = null;
  }
  get entities() {
    return this.entityMan.entities;
  }
  set entities(entities) {
    this.entityMan.entities = entities;
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

class PlayState extends State { //게임상태를 계속 업데이트한다 game.js에서
  constructor({game, running, systems, entityMan, canvas, level}) {
    super({game, running, systems, entityMan});
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
    this.playerId = this.entityMan.add(
      new Fighter001({
        state: this,
        comps: {
          pos: new PosComp({x: 1500, y: 2000}),
          mov: new MovComp({velY: -15}),
          camOut: new CamOutComp({type: CamOutComp.BLOCK}),
          shooting: new ShootingComp({coolTime: 1}),
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

  genEntity() {
    /*
    let entityData = this.level[this.levelEntityIndex];
    while(entityData && this.camera.y <= entityData.y) {
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
   
    if(Math.random() > 0.98) { //행성은 자주 생겨납니다
      this.entityMan.add(
        new Alien001({ //적을생성합니다!
          state: this, //playstate
          comps: {
            pos: new PosComp({x: Math.random() * ((this.canvas.width / this.camera.scale) + this.camera.x) , y: this.camera.y}),
            team: new TeamComp({value: 'enemy'})
          },
        })
      );   
    }

    if(Math.random() > 0.995) { //포션을 생성합니다
      this.entityMan.add(   //포션은 조금씩생성됩니다
        new Potion({
          state: this, //playstate
          comps: {
            pos: new PosComp({x: Math.random() * ((this.canvas.width / this.camera.scale) + this.camera.x) , y: this.camera.y}),
            team: new TeamComp({value: 'enemy'})
          },
        })
      );   
    }
    

    if(Math.random() > 0.9979) { //보스를 생성합니다. 보스는 조금생성됩니다
      this.entityMan.add(
        new Boss({
          state: this, //playstate
          comps: {
            pos: new PosComp({x: Math.random() * ((this.canvas.width / this.camera.scale) + this.camera.x) , y: this.camera.y+100}),
            team: new TeamComp({value: 'enemy'})
          },
        })
      );   
    }






  }

  update() {
    if(this.running == false)
      return;
    const player = this.entityMan.get(this.playerId);
    if(player) {
      const pos = player.comps['pos'];
      const shooting = player.comps['shooting'];
      if(this.event.ArrowUp)
        pos.y -= 30;
      if(this.event.ArrowDown)
        pos.y += 30;
      if(this.event.ArrowLeft)
        pos.x -= 30;
      if(this.event.ArrowRight)
        pos.x += 30;
      if(this.event.Space) {
        if(shooting.enabled) {
          this.entityMan.add(
            new Bullet001({
              state: this,
              comps: {
                pos: new PosComp({x: pos.x, y: pos.y}),
              }
            })
          );
        }
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let [id, entity] of Object.entries(this.entities)) {
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
  destroy() {
    removeEventListener('keydown', this.handleKeyDown);
    removeEventListener('keyup', this.handleKeyUp);
  }
}

export {State, PlayState};
