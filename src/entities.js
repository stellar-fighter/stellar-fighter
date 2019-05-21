import {PosComp, MovComp, SizeComp, VisComp, CamOutComp, CollComp, HpComp, TeamComp} from './comps';
import {Vec} from './vec';
import {Sprite} from './sprites';
import {HpDisplay} from './scene_nodes';

class Entity {
  constructor({name, state, comps}) {
    this.name = name;
    if(state === undefined)
      throw new Error('RequiredParam');
    this.state = state;
    this.comps = comps || {};
    this.alive = true;
  }
  addComp(comp) {
    this.comps[comp.name] = comp;
  }
  delComp(name) {
    delete this.comps[name];
  }
  get alive() {
    if(this._alive === undefined)
      return true;
    return this._alive;
  }
  set alive(alive) {
    if(this._alive === undefined || this._alive == true)
      this._alive = alive;
  }
}

class EntityMan {
  constructor({entities}) {
    this.entities = entities || {};
    this.nextId = 0;
  }
  genId() {
    ++this.nextId;
    if(this.nextId == Infinity)
      this.nextId = 0;
    return Date.now() + this.nextId.toString();
  }
  get(id) {
    return this.entities[id];
  }
  add(entity) {
    if(entity.id === undefined)
      entity.id = this.genId();
    this.entities[entity.id] = entity;
    return entity.id;
  }
  del(id) {
    const entity = this.entities[id];
    entity.alive = false;
    entity.comps['vis'].sn.alive = false;
    delete this.entities[id];
    return entity;
  }
  forEach(callback) {
    Object.values().forEach(callback);
  }
}

class Fighter001 extends Entity {
  constructor({state, comps}) {
    super({state, comps});
    const {pos, mov, size, camOut, coll, hp, team, vis} = this.comps;
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(mov === undefined)
      this.addComp(new MovComp({}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: new Vec(600, 800)}));
    if(camOut === undefined)
      this.addComp(new CamOutComp({}));
    if(coll === undefined)
      this.addComp(new CollComp({damage: 1}));
    if(hp === undefined)
      this.addComp(new HpComp({val: 100}));
    if(team === undefined)
      this.addComp(new TeamComp({val: 'PLAYER'}));
    if(vis === undefined) {
      const {pos, size, hp} = this.comps;
      const sn = new Sprite({
        canvas: this.state.canvas,
        ctx: this.state.ctx,
        camera: this.state.camera,
        pos: pos.vec,
        size: size.vec,
        image: this.state.game.assets.fighter001
      });
      sn.addChild(new HpDisplay({hp, pos, size}));
      this.addComp(new VisComp({sn}));
    }
  }
}

class Boss001 extends Entity {
  constructor({state, comps}) {
    super({state, comps, name: "Boss"});
    this.direction = 1;
    this.directionY = 1;
    if(this.comps['pos'] === undefined)
      this.addComp(new PosComp({}));
    if(this.comps['mov'] === undefined)
      this.addComp(new MovComp({}));
    if(this.comps['size'] === undefined)
      this.addComp(new SizeComp({vec: new Vec(500, 400)}));
    if(this.comps['vis'] === undefined)
      this.addComp(new VisComp({image: this.state.game.assets.fighter001}));
    if(this.comps['camOut'] === undefined)
      this.addComp(new CamOutComp({}));
    if(this.comps['coll'] === undefined)
      this.addComp(new CollComp({damage: 1}));
    if(this.comps['hp'] === undefined)
      this.addComp(new HpComp({val: 80}));
    if(this.comps['team'] === undefined)
      this.addComp(new TeamComp({value: 'ENEMY'}));
  }
}

class Alien001 extends Entity {
  constructor({state, comps}) {
    super({state, comps, name: "Alien"});
    if(this.comps['pos'] === undefined)
      this.addComp(new PosComp({}));
    if(this.comps['mov'] === undefined)
      this.addComp(new MovComp({}));
    if(this.comps['size'] === undefined)
      this.addComp(new SizeComp({vec: new Vec(300, 400)}));
    if(this.comps['vis'] === undefined)
      this.addComp(new VisComp({image: this.state.game.assets.fighter001}));
    if(this.comps['camOut'] === undefined)
      this.addComp(new CamOutComp({}));
    if(this.comps['coll'] === undefined)
      this.addComp(new CollComp({damage: 20}));
    if(this.comps['hp'] === undefined)
      this.addComp(new HpComp({value: 1}));
    if(this.comps['team'] === undefined)
      this.addComp(new TeamComp({value: 'ENEMY'}));
  }
}

class HpItem extends Entity {
  constructor({state, comps}) {
    super({state, comps, name: "Potion"});
    this.direction = 1;
    if(this.comps['pos'] === undefined)
      this.addComp(new PosComp({}));
    if(this.comps['mov'] === undefined)
      this.addComp(new MovComp({}));
    if(this.comps['size'] === undefined)
      this.addComp(new SizeComp({vec: new Vec(300, 400)}));
    if(this.comps['vis'] === undefined)
      this.addComp(new VisComp({image: this.state.game.assets.fighter001}));
    if(this.comps['camOut'] === undefined)
      this.addComp(new CamOutComp({}));
    if(this.comps['coll'] === undefined)
      this.addComp(new CollComp({damage: -20}));
    if(this.comps['hp'] === undefined)
      this.addComp(new HpComp({value: 1}));
    if(this.comps['team'] === undefined)
      this.addComp(new TeamComp({value: 'ENEMY'}));
  }
}

class Bullet001 extends Entity {
  constructor({state, comps}) {
    super({state, comps});
    const {pos, mov, size, camOut, coll, team, hp, vis} = this.comps;
    if(this.comps['pos'] === undefined)
      this.addComp(new PosComp({}));
    if(this.comps['mov'] === undefined)
      this.addComp(new MovComp({vel: new Vec(0, -60)}));
    if(this.comps['size'] === undefined)
      this.addComp(new SizeComp({vec: new Vec(100, 100)}));
    if(this.comps['camOut'] === undefined)
      this.addComp(new CamOutComp({}));
    if(this.comps['coll'] === undefined)
      this.addComp(new CollComp({damage: 10}));
    if(this.comps['hp'] === undefined)
      this.addComp(new HpComp({val: 1}));
    if(this.comps['team'] === undefined)
      this.addComp(new TeamComp({val: 'PLAYER'}));
    if(this.comps['vis'] === undefined) {
      const {pos, size, hp} = this.comps;
      const sn = new Sprite({
        canvas: this.state.canvas,
        ctx: this.state.ctx,
        camera: this.state.camera,
        pos: pos.vec,
        size: size.vec,
        image: this.state.game.assets.bullet001
      });
      this.addComp(new VisComp({sn}));
    }
  }
}

export {Entity, EntityMan, Fighter001, Alien001, Bullet001, Boss001, Hpitem};
