import {PosComp, MovComp, SizeComp, VisComp, CamOutComp, CollComp, HpComp, TeamComp, ShootingComp, ScoreComp} from './comps';
import {Vec} from './vec';
import {Sprite, HpDisplay} from './scene_nodes';

/**
 * A super Entity class that creates entity object
 */
class Entity {
  /**
   * Create a new Entity object
   * @constructor
   * @param {Object} params - The object for parameters
   * @param {string} params.name - The name of entity object
   * @param {Object} params.state - The State object for entity's current State
   * @param {Object[]} params.comps - The array of Comps object including entity's pos, mov, shooting, team and etc
   */
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

/**
 * A Entity Manager class that manages entities in current state
 */
class EntityMan {
  /**
   * Create a new EntityMan object
   * @constructor
   * @param {Object} params - The object for parameters
   * @param {Object[]} params.entities - The array of entity objects
   */
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
    /**
     * Delete a single entitiy object
     * @param {int} id - The id value of specific entity object to delete
     * @return {Object} The deleted entity object
     */
    const entity = this.entities[id];
    if(entity === undefined)
      return null;
    entity.alive = false;
    entity.comps['vis'].sn.alive = false; // temporary code
    delete this.entities[id];
    return entity;
  }
  forEach(callback) {
    Object.vals().forEach(callback);
  }
}

/**
 * A Fighter001 class that creates player's fighter object
 * @extends Entity
 */
class Fighter001 extends Entity {
  /**
   * Create a new Fighter001 object
   * @constructor
   * @param {Object} params - The object for parameters
   * @param {Object} params.state - The State object for player's current State
   * @param {Object[]} params.comps - The array of Comps object including player's pos, mov, size, camOut, coll, hp, team, shooting, vis, score value
   */
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
      this.addComp(new CamOutComp({actions: {UP: 'BLOCK', DOWN: 'BLOCK', LEFT: 'BLOCK', RIGHT: 'BLOCK'}}));
    if(coll === undefined)
      this.addComp(new CollComp({damage: 1, timer: this.state.timer}));
    if(hp === undefined)
      this.addComp(new HpComp({val: 100}));
    if(team === undefined)
      this.addComp(new TeamComp({val: 'PLAYER'}));
    if(shooting === undefined)
      this.addComp(new ShootingComp({coolTime: 100, timer: this.state.timer, power: new Vec(0, -1).setMag(5), bullet: Bullet001}));
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
      this.addComp(new ScoreComp({score: 10}));
  }
}

/**
 * An Alien001 class that creates enemy's fighter object
 * @extends Entity
 */
class Alien001 extends Entity {
  /**
   * Create a new Alien001 object
   * @constructor
   * @param {Object} params - The object for parameters
   * @param {Object} params.state - The State object for current State
   * @param {Object[]} params.comps - The array of Comps object including enemy fighter's pos, mov, size, camOut, coll, hp, team, shooting, vis, score value
   */
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
      this.addComp(new ShootingComp({enabled: true, coolTime: 3000, timer: this.state.timer, power: new Vec(0, 1).setMag(5), bullet: Bullet002}));
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
      this.addComp(new ScoreComp({score: 10}));
  }
}

/**
 * An Alien002 class that creates enemy's fighter object
 * @extends Entity
 */
class Alien002 extends Entity {
  /**
   * Create a new Alien002 object
   * @constructor
   * @param {Object} params - The object for parameters
   * @param {Object} params.state - The State object for current State
   * @param {Object[]} params.comps - The array of Comps object including enemy fighter's pos, mov, size, camOut, coll, hp, team, shooting, vis, score value
   */
  constructor({state, comps}) {
    super({state, comps, name: 'alien002'});
    const {pos, mov, size, vis, camOut, coll, hp, team, shooting, score} = this.comps;
    const assetMan = this.state.game.assetMan;
    const texture = assetMan.images.alien002;
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(mov === undefined)
      this.addComp(new MovComp({vel: new Vec(1, 1).setAng(Math.random() * Math.PI * 2).setMag(15)}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: new Vec(texture.width, texture.height).setMag(500)}));
    if(camOut === undefined)
      this.addComp(new CamOutComp({actions: {UP: 'NONE', DOWN: 'DESTROY', LEFT: 'BOUNCE', RIGHT: 'BOUNCE'}}));
    if(coll === undefined)
      this.addComp(new CollComp({damage: 1, timer: this.state.timer}));
    if(hp === undefined)
      this.addComp(new HpComp({val: 30}));
    if(team === undefined)
      this.addComp(new TeamComp({val: 'ENEMY'}));
    if(shooting === undefined)
      this.addComp(new ShootingComp({enabled: true, coolTime: 500, timer: this.state.timer, power: new Vec(0, 0), bullet: Bullet002}));
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
      this.addComp(new ScoreComp({score: 10}));
  }
}

/**
 * An Item001 class that recovers player's HP
 * @extends Entity
 */
class Item001 extends Entity {
  /**
   * Create a new Item001 object
   * @constructor
   * @param {Object} params - The object for parameters
   * @param {Object} params.state - The State object for current State
   * @param {Object[]} params.comps - The array of Comps object including enemy fighter's pos, mov, size, camOut, coll, hp, team, shooting, vis, score value
   */
  constructor({state, comps}) {
    super({state, comps, name: "item001"});
    const {pos, mov, size, camOut, coll, hp, team, vis, score} = this.comps;
    const assetMan = this.state.game.assetMan;
    const texture = assetMan.images.item001;
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(mov === undefined)
      this.addComp(new MovComp({vel: new Vec(1, 1).setAng(Math.random() * Math.PI * 2).setMag(15)}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: new Vec(texture.width, texture.height).setMag(500)}));
    if(camOut === undefined)
      this.addComp(new CamOutComp({actions: {UP: 'NONE', DOWN: 'DESTROY', LEFT: 'BOUNCE', RIGHT: 'BOUNCE'}}));
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

/**
 * An Bullet001 class that creates bullet object made by player's control
 * @extends Entity
 */
class Bullet001 extends Entity {
  /**
   * Create a new Bullet001 object
   * @constructor
   * @param {Object} params - The object for parameters
   * @param {Object} params.state - The State object for current State
   * @param {Object[]} params.comps - The array of Comps object including enemy fighter's pos, mov, size, camOut, coll, hp, team, shooting, vis value
   * @param {int} params.speed - The speed of bullet movement
   */
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
      this.addComp(new CamOutComp({actions: {UP: 'DESTROY', DOWN: 'DESTROY', LEFT: 'DESTROY', RIGHT: 'DESTROY'}}));
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
  }
  static get defaultSize() { // temporary fix for bullet positioning, at last, we have to use relative coordinates
    return new Vec(100, 100);
  }
}

/**
 * An Bullet002 class that creates bullet object made by enemies
 * @extends Entity
 */
class Bullet002 extends Entity {
  /**
   * Create a new Bullet002 object
   * @constructor
   * @param {Object} params - The object for parameters
   * @param {Object} params.state - The State object for current State
   * @param {Object[]} params.comps - The array of Comps object including enemy fighter's pos, mov, size, camOut, coll, hp, team, shooting, vis value
   * @param {int} params.speed - The speed of bullet movement
   */
  constructor({state, comps, speed}) {
    super({state, comps});
    const {pos, size, camOut, coll, team, hp, vis, score} = this.comps;
    const assetMan = this.state.game.assetMan;
    this.addComp(new MovComp({vel: new Vec(1, 1).setMag(5)}));
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: Bullet002.defaultSize}));
    if(camOut === undefined)
      this.addComp(new CamOutComp({actions: {UP: 'DESTROY', DOWN: 'DESTROY', LEFT: 'DESTROY', RIGHT: 'DESTROY'}}));
    if(coll === undefined)
      this.addComp(new CollComp({damage: 10, timer: this.state.timer}));
    if(hp === undefined)
      this.addComp(new HpComp({val: 1}));
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
        texture: assetMan.images.bullet002
      });
      this.addComp(new VisComp({sn}));
    }
  }
  static get defaultSize() { // temporary fix for bullet positioning, at last, we have to use relative coordinates
    return new Vec(100, 100);
  }
}

/**
 * An Bullet003 class that creates bullet object made by enemies
 * @extends Entity
 */
class Bullet003 extends Entity {
  /**
   * Create a new Bullet003 object
   * @constructor
   * @param {Object} params - The object for parameters
   * @param {Object} params.state - The State object for current State
   * @param {Object[]} params.comps - The array of Comps object including enemy fighter's pos, mov, size, camOut, coll, hp, team, shooting, vis value
   * @param {int} params.speed - The speed of bullet movement
   */
  constructor({state, comps, speed}) {
    super({state, comps});
    const {pos, size, camOut, coll, team, hp, vis} = this.comps;
    const assetMan = this.state.game.assetMan;
    this.addComp(new MovComp({vel: new Vec(1, 1).setMag(5)}));
    if(pos === undefined)
      this.addComp(new PosComp({}));
    if(size === undefined)
      this.addComp(new SizeComp({vec: Bullet002.defaultSize}));
    if(camOut === undefined)
      this.addComp(new CamOutComp({actions: {UP: 'DESTROY', DOWN: 'DESTROY', LEFT: 'DESTROY', RIGHT: 'DESTROY'}}));
    if(coll === undefined)
      this.addComp(new CollComp({damage: 10, timer: this.state.timer}));
    if(hp === undefined)
      this.addComp(new HpComp({val: 1}));
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
        texture: assetMan.images.bullet003
      });
      this.addComp(new VisComp({sn}));
    }
  }
  static get defaultSize() { // temporary fix for bullet positioning, at last, we have to use relative coordinates
    return new Vec(100, 100);
  }
}


export {Entity, EntityMan, Fighter001, Alien001, Alien002, Bullet001, Bullet002, Bullet003, Item001};
