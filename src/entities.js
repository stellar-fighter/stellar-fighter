import {PosComp, MovComp, SizeComp, VisComp, CamOutComp} from './comps';
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

class StellarFighter extends Entity {
  constructor({state, comps}) {
    super({state, comps});
    for(let comp in comps)
      this.addComp(comp);
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
  }
}

class A001 extends Entity {
}

export {Entity, StellarFighter, A001};
