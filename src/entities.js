import {PosComp, MovComp, SizeComp, VisComp, CamOutComp, CollComp, HpComp, TeamComp, ShootingComp, ScoreComp} from './comps';
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
    const {pos, mov, size, camOut, coll, hp, team, shooting, vis, score} = this.comps;
    const assetMan = this.state.game.assetMan;
    const texture = assetMan.images.fighter001;
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(mov === undefined)
      this.addComp(new MovComp({}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: new Vec(texture.width, texture.height).setMag(500)}));
    if(camOut === undefined)
      this.addComp(new CamOutComp({type: CamOutComp.BLOCK}));
    if(coll === undefined)
      this.addComp(new CollComp({damage: 1, timer: this.state.timer}));
    if(hp === undefined)
      this.addComp(new HpComp({val: 100}));
    if(team === undefined)
      this.addComp(new TeamComp({val: 'PLAYER'}));
    if(shooting === undefined)
      this.addComp(new ShootingComp({coolTime: 100, timer: this.state.timer, power: new Vec(0, -1).setMag(5)}));
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
    if(score === undefined)
      this.addComp(new ScoreComp({score: 100}));
  }
}

class Alien001 extends Entity {
  constructor({state, comps}) {
    super({state, comps, name: 'alien001'});
    const {pos, mov, size, camOut, coll, hp, team, shooting, vis, score} = this.comps;
    const assetMan = this.state.game.assetMan;
    const texture = assetMan.images.alien001;
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(mov === undefined)
      this.addComp(new MovComp({}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: new Vec(texture.width, texture.height).setMag(500)}));
    if(camOut === undefined)
      this.addComp(new CamOutComp({}));
    if(coll === undefined)
      this.addComp(new CollComp({damage: 20, timer: this.state.timer, coolTime: 1000}));
    if(hp === undefined)
      this.addComp(new HpComp({val: 40}));
    if(team === undefined)
      this.addComp(new TeamComp({val: 'ENEMY'}));
    if(shooting === undefined)
      this.addComp(new ShootingComp({enabled: true, coolTime: 3000, timer: this.state.timer, power: new Vec(0, 1).setMag(5)}));
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
    if(score === undefined)
      this.addComp(new ScoreComp({score: 100}));
  }
}

class Alien002 extends Entity {
  constructor({state, comps}) {
    super({state, comps, name: 'alien002'});
    const {pos, mov, size, vis, camOut, coll, hp, team, shooting, score} = this.comps;
    const assetMan = this.state.game.assetMan;
    const texture = assetMan.images.alien002;
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(mov === undefined)
      this.addComp(new MovComp({}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: new Vec(texture.width, texture.height).setMag(500)}));
    if(camOut === undefined)
      this.addComp(new CamOutComp({}));
    if(coll === undefined)
      this.addComp(new CollComp({damage: 1, timer: this.state.timer}));
    if(hp === undefined)
      this.addComp(new HpComp({val: 20}));
    if(team === undefined)
      this.addComp(new TeamComp({val: 'ENEMY'}));
    if(shooting === undefined)
      this.addComp(new ShootingComp({enabled: true, coolTime: 500, timer: this.state.timer, power: new Vec(0, -1).setMag(5)}));
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
    if(score === undefined)
      this.addComp(new ScoreComp({score: 100}));
  }
}

class Item001 extends Entity {
  constructor({state, comps}) {
    super({state, comps, name: "item001"});
    const {pos, mov, size, camOut, coll, hp, team, vis, score} = this.comps;
    const assetMan = this.state.game.assetMan;
    const texture = assetMan.images.item001;
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(mov === undefined)
      this.addComp(new MovComp({}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: new Vec(texture.width, texture.height).setMag(500)}));
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
    if(score === undefined)
      this.addComp(new ScoreComp({score: 100}));
  }
}

class Bullet001 extends Entity {
  constructor({state, comps, speed}) {
    super({state, comps});
    const {pos, size, camOut, coll, team, hp, vis, score} = this.comps;
    const assetMan = this.state.game.assetMan;
    this.addComp(new MovComp({vel: new Vec(1, 1).setMag(5)}));
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
        texture: assetMan.images.bullet001
      });
      this.addComp(new VisComp({sn}));
    }
    if(score === undefined)
      this.addComp(new ScoreComp({score: 0}));
  }
  static get defaultSize() { // temporary fix for bullet positioning, at last, we have to use relative coordinates
    return new Vec(100, 100);
  }
}

export {Entity, EntityMan, Fighter001, Alien001, Bullet001, Alien002, Item001};
