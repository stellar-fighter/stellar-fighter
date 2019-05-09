class System {
  constructor({entities, compNames}) {
    this.entities = entities || [];
    this.compNames = compNames || [];
  }
  filter(entity) {
    for(let compName of this.compNames) {
      if(entity.comps[compName] === undefined)
        return false;
    });
    return true;
  }
  process() {
    throw new Error('AbstractMethod');
  }
}

export {System};
