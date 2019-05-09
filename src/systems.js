class System {
  constructor({state, compNames}) {
    this.state = state;
    this.compNames = compNames || [];
  }
  filter(entity) {
    for(let compName of this.compNames) {
      if(entity.comps[compName] === undefined)
        return false;
    }
    return true;
  }
  process() {
    throw new Error('AbstractMethod');
  }
}

class MovSystem extends System {
  constructor({state, compNames}) {
    super({state, compNames: ['pos', 'mov']});
  }
  process() {
    for(let entity of this.state.entities) {
      if(this.filter(entity) == true) {
        entity.comps['mov'].velX += entity.comps['mov'].accX;
        entity.comps['mov'].accX = 0;
        entity.comps['mov'].velY += entity.comps['mov'].accY;
        entity.comps['mov'].accY = 0;
        entity.comps['pos'].x += entity.comps['mov'].velX;
        entity.comps['pos'].y += entity.comps['mov'].velY;
      }
    }
  }
}

class CollSystem extends System {
}

export {System, MovSystem, CollSystem};
