import {PosComp, MovComp, SizeComp, VisComp, CamOutComp, CollComp, HpComp, TeamComp} from './comps';
class Entity {
  constructor({state, comps}) {
    this.state = state;
    this.comps = comps || {};
    //this.comps = {};
    for(let comp in comps) {
      console.log(comps);
      console.log('------------');
      console.log(comp.name);
      this.addComp(comp);
    }
  }
  addComp(comp) {
    this.comps[comp.name] = comp;
  }
  delComp(name) {
    delete this.comps[name];
  }
}

class F001 extends Entity {
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

class A001 extends Entity {
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

export {Entity, F001, A001, Bullet001};
