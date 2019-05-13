import {PosComp, MovComp, SizeComp, VisComp, CamOutComp, CollComp, HpComp, TeamComp} from './comps';

class Entity {
  constructor({state, comps}) {
    this.state = state;
    this.comps = comps || {};
  }
  addComp(comp) {
    this.comps[comp.name] = comp;
  }
  delComp(name) {
    delete this.comps[name];
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
    delete this.entities[id];
    return entity;
  }
}

class Fighter001 extends Entity {
  constructor({state, comps}) {
    super({state, comps});
    if(this.comps['pos'] === undefined)
      this.addComp(new PosComp({}));
    if(this.comps['mov'] === undefined)
      this.addComp(new MovComp({}));
    if(this.comps['size'] === undefined)
      this.addComp(new SizeComp({width: 600, height: 800}));
    if(this.comps['vis'] === undefined)
      this.addComp(new VisComp({image: this.state.game.assets.stellarFighter}));
    if(this.comps['camOut'] === undefined)
      this.addComp(new CamOutComp({}));
    if(this.comps['coll'] === undefined)
      this.addComp(new CollComp({damage: 1}));
    if(this.comps['hp'] === undefined)
      this.addComp(new HpComp({value: 100}));
    if(this.comps['team'] === undefined)
      this.addComp(new TeamComp({value: 'PLAYER'}));
  }
}

class Alien001 extends Entity {
}

class Bullet001 extends Entity {
  constructor({state, comps}) {
    super({state, comps});
    if(this.comps['pos'] === undefined)
      this.addComp(new PosComp({}));
    if(this.comps['mov'] === undefined)
      this.addComp(new MovComp({velY: -30}));
    if(this.comps['size'] === undefined)
      this.addComp(new SizeComp({width: 100, height: 500}));
    if(this.comps['vis'] === undefined)
      this.addComp(new VisComp({image: this.state.game.assets.fire}));
    if(this.comps['camOut'] === undefined)
      this.addComp(new CamOutComp({}));
    if(this.comps['coll'] === undefined)
      this.addComp(new CollComp({damage: 1}));
    if(this.comps['hp'] === undefined)
      this.addComp(new HpComp({value: 1}));
    if(this.comps['team'] === undefined)
      this.addComp(new TeamComp({value: 'PLAYER'}));
  }
}

export {Entity, EntityMan, Fighter001, Alien001, Bullet001};
