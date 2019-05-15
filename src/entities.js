import {PosComp, MovComp, SizeComp, VisComp, CamOutComp, CollComp, HpComp, TeamComp} from './comps';

class Entity {
  constructor({state, comps, name}) {
    this.state = state;
    this.comps = comps || {};
    this.name = name;
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
    super({state, comps, name: "Fighter",});
    if(this.comps['pos'] === undefined)
      this.addComp(new PosComp({}));
    if(this.comps['mov'] === undefined)
      this.addComp(new MovComp({}));
    if(this.comps['size'] === undefined)
      this.addComp(new SizeComp({width: 300, height: 400}));
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
////////////////////*
class Boss extends Entity {  //보스는 큰 피통과, 크기를 가지고있습니다
  constructor({state, comps}) {
    super({state, comps, name: "Boss"});
    this.direction = 1;
    this.directionY=1;
    if(this.comps['pos'] === undefined)
      this.addComp(new PosComp({}));
    if(this.comps['mov'] === undefined)
      this.addComp(new MovComp({}));
    if(this.comps['size'] === undefined)
      this.addComp(new SizeComp({width: 1000, height: 800}));
    if(this.comps['vis'] === undefined)
      this.addComp(new VisComp({image: this.state.game.assets.boss}));
    if(this.comps['camOut'] === undefined)
      this.addComp(new CamOutComp({}));
    if(this.comps['coll'] === undefined)
      this.addComp(new CollComp({damage: 1}));
    if(this.comps['hp'] === undefined)
      this.addComp(new HpComp({value: 10000}));
    if(this.comps['team'] === undefined)
      this.addComp(new TeamComp({value: 'PLAYER'}));
  }
}





/////////////////////
class Alien001 extends Entity { //alien 즉 지금은행성으로되어있어 부딪히면 피가 사라지고 객체가 사라집니다

  constructor({state, comps}) {
    super({state, comps, name: "Alien"});
    if(this.comps['pos'] === undefined)
      this.addComp(new PosComp({}));
    if(this.comps['mov'] === undefined)
      this.addComp(new MovComp({}));
    if(this.comps['size'] === undefined)
      this.addComp(new SizeComp({width: 300, height: 400}));
    if(this.comps['vis'] === undefined)
      this.addComp(new VisComp({image: this.state.game.assets.alien001}));
    if(this.comps['camOut'] === undefined)
      this.addComp(new CamOutComp({}));
    if(this.comps['coll'] === undefined)
      this.addComp(new CollComp({damage: 20}));
    if(this.comps['hp'] === undefined)
      this.addComp(new HpComp({value: 1}));
    if(this.comps['team'] === undefined)
      this.addComp(new TeamComp({value: 'PLAYER'}));
  }
}
///////////
class Potion extends Entity { //포션의 경우 먹을때 없어지고, hp 가 차오릅니다
  constructor({state, comps}) {
    super({state, comps, name: "Potion"});
    this.direction = 1;
    if(this.comps['pos'] === undefined)
      this.addComp(new PosComp({}));
    if(this.comps['mov'] === undefined)
      this.addComp(new MovComp({}));
    if(this.comps['size'] === undefined)
      this.addComp(new SizeComp({width: 300, height: 400}));
    if(this.comps['vis'] === undefined)
      this.addComp(new VisComp({image: this.state.game.assets.potion}));
    if(this.comps['camOut'] === undefined)
      this.addComp(new CamOutComp({}));
    if(this.comps['coll'] === undefined)
      this.addComp(new CollComp({damage: -20}));
    if(this.comps['hp'] === undefined)
      this.addComp(new HpComp({value: 1}));
    if(this.comps['team'] === undefined)
      this.addComp(new TeamComp({value: 'PLAYER'}));
  }
}

////////
class Bullet001 extends Entity {
  constructor({state, comps}) {
    super({state, comps});
    if(this.comps['pos'] === undefined)
      this.addComp(new PosComp({}));
    if(this.comps['mov'] === undefined)
      this.addComp(new MovComp({velY: -30}));
    if(this.comps['size'] === undefined)
      this.addComp(new SizeComp({width: 50, height: 250}));
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

export {Entity, EntityMan, Fighter001, Alien001, Bullet001,Potion,Boss};
