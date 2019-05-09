import {PosComp, MovComp, SizeComp, VisComp} from './comps';
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
    this.addComp(comps['pos'] || new PosComp({}));
    this.addComp(comps['mov'] || new MovComp({}));
    this.addComp(comps['size'] || new SizeComp({width: 600, height: 800}));
    this.addComp(comps['vis'] || new VisComp({image: this.state.game.assets.stellarFighter}));
  }
}

class A001 extends Entity {
}

export {Entity, StellarFighter, A001};
