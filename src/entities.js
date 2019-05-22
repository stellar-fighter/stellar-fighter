import {PosComp, MovComp, SizeComp, VisComp, CamOutComp, CollComp, HpComp, TeamComp, ShootingComp} from './comps';
import {Vec} from './vec';
import {Sprite, HpDisplay} from './scene_nodes';

class Entity {
  constructor({name, state, comps}) {
    this.name = name;
    this.state = state;
    if(this.state === undefined)
      throw new Error('RequiredParam');
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
    entity.comps['vis'].sn.alive = false; // temporary code
    delete this.entities[id];
    return entity;
  }
  forEach(callback) {
    Object.vals().forEach(callback);
  }
}

class Fighter001 extends Entity {
  constructor({state, comps}) {
    super({state, comps});
    const {pos, mov, size, camOut, coll, hp, team, shooting, vis} = this.comps;
    const texture = this.state.game.assets.fighter001;
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(mov === undefined)
      this.addComp(new MovComp({}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: new Vec(texture.width, texture.height).setMag(50)}));
    if(camOut === undefined)
      this.addComp(new CamOutComp({type: CamOutComp.BLOCK}));
    if(coll === undefined)
      this.addComp(new CollComp({damage: 1, timer: this.state.timer}));
    if(hp === undefined)
      this.addComp(new HpComp({val: 100}));
    if(team === undefined)
      this.addComp(new TeamComp({val: 'PLAYER'}));
    if(shooting === undefined)
      this.addComp(new ShootingComp({coolTime: 100, timer: this.state.timer, power: new Vec(0, -15)}));
    if(vis === undefined) {
      const {pos, size, hp} = this.comps;
      const sn = new Sprite({
        canvas: this.state.canvas,
        ctx: this.state.ctx,
        camera: this.state.camera,
        pos: pos.vec,
        size: size.vec,
        texture
      });
      sn.addChild(new HpDisplay({hp, pos, size}));
      this.addComp(new VisComp({sn}));
    }
  }
}

class Alien001 extends Entity {
  constructor({state, comps}) {
    super({state, comps, name: 'alien001'});
    const {pos, mov, size, camOut, coll, hp, team, shooting, vis} = this.comps;
    const texture = this.state.game.assets.alien001;
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(mov === undefined)
      this.addComp(new MovComp({}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: new Vec(texture.width, texture.height).setMag(50)}));
    if(camOut === undefined)
      this.addComp(new CamOutComp({}));
    if(coll === undefined)
      this.addComp(new CollComp({damage: 20, timer: this.state.timer, coolTime: 1000}));
    if(hp === undefined)
      this.addComp(new HpComp({val: 40}));
    if(team === undefined)
      this.addComp(new TeamComp({val: 'ENEMY'}));
    if(shooting === undefined)
      this.addComp(new ShootingComp({enabled: true, coolTime: 3000, timer: this.state.timer, power: new Vec(0, 10)}));
    if(vis === undefined) {
      const {pos, size, hp} = this.comps;
      const sn = new Sprite({
        canvas: this.state.canvas,
        ctx: this.state.ctx,
        camera: this.state.camera,
        pos: pos.vec,
        size: size.vec,
        texture
      });
      sn.addChild(new HpDisplay({hp, pos, size}));
      this.addComp(new VisComp({sn}));
    }
  }
}

class Alien002 extends Entity {
  constructor({state, comps}) {
    super({state, comps, name: 'alien002'});
    const {pos, mov, size, vis, camOut, coll, hp, team, shooting} = this.comps;
    const texture = this.state.game.assets.alien002;
    this.direction = 1; // this hardcoded part should be removed
    this.directionY = 1;
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(mov === undefined)
      this.addComp(new MovComp({}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: new Vec(texture.width, texture.height).setMag(50)}));
    if(camOut === undefined)
      this.addComp(new CamOutComp({}));
    if(coll === undefined)
      this.addComp(new CollComp({damage: 1, timer: this.state.timer}));
    if(hp === undefined)
      this.addComp(new HpComp({val: 20}));
    if(team === undefined)
      this.addComp(new TeamComp({val: 'ENEMY'}));
    if(shooting === undefined)
      this.addComp(new ShootingComp({enabled: true, coolTime: 500, timer: this.state.timer, power: new Vec(0, -1)}));
    if(vis === undefined) {
      const {pos, size, hp} = this.comps;
      const sn = new Sprite({
        canvas: this.state.canvas,
        ctx: this.state.ctx,
        camera: this.state.camera,
        pos: pos.vec,
        size: size.vec,
        texture
      });
      sn.addChild(new HpDisplay({hp, pos, size}));
      this.addComp(new VisComp({sn}));
    }
  }
}

class Item001 extends Entity {
  constructor({state, comps}) {
    super({state, comps, name: "item001"});
    const {pos, mov, size, camOut, coll, hp, team, vis} = this.comps;
    const texture = this.state.game.assets.item001;
    this.direction = 1;
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(mov === undefined)
      this.addComp(new MovComp({}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: new Vec(texture.width, texture.height).setMag(50)}));
    if(camOut === undefined)
      this.addComp(new CamOutComp({}));
    if(coll === undefined)
      this.addComp(new CollComp({damage: -5, timer: this.state.timer, coolTime: 800}));
    if(hp === undefined)
      this.addComp(new HpComp({val: Infinity}));
    if(team === undefined)
      this.addComp(new TeamComp({val: 'ENEMY'}));
    if(vis === undefined) {
      const {pos, size, hp} = this.comps;
      const sn = new Sprite({
        canvas: this.state.canvas,
        ctx: this.state.ctx,
        camera: this.state.camera,
        pos: pos.vec,
        size: size.vec,
        texture
      });
      sn.addChild(new HpDisplay({hp, pos, size}));
      this.addComp(new VisComp({sn}));
    }
  }
}

class Bullet001 extends Entity {
  constructor({state, comps, speed}) {
    super({state, comps});
    const {pos, size, camOut, coll, team, hp, vis} = this.comps;
    this.addComp(new MovComp({vel: new Vec(1, 1).setMag(10)}));
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: Bullet001.defaultSize}));
    if(camOut === undefined)
      this.addComp(new CamOutComp({}));
    if(coll === undefined)
      this.addComp(new CollComp({damage: 10, timer: this.state.timer}));
    if(hp === undefined)
      this.addComp(new HpComp({val: 1}));
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
        texture: this.state.game.assets.bullet001
      });
      this.addComp(new VisComp({sn}));
    }
  }
  static get defaultSize() { // temporary fix for bullet positioning, at last, we have to use relative coordinates
    return new Vec(100, 100);
  }
}

export {Entity, EntityMan, Fighter001, Alien001, Bullet001, Alien002, Item001};
