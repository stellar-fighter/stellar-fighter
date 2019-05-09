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

class CamDeathSystem extends System {
  constructor({state, compNames}) {
    super({state, compNames: ['cam-death', 'pos']});
  }
  process() {
    const camera = this.state.camera;
    const canvas = this.state.canvas;
    for(let index = this.state.entities.length - 1; index >= 0; --index) {
      let entity = this.state.entities[index];
      let camDeath = entity.comps['cam-death'];
      let pos = entity.comps['pos'];

      if(camDeath && pos)
        console.log((pos.y - camera.y) * camera.scale);
      if(this.filter(entity) == true && camDeath &&
         ((pos.x - camera.x) * camera.scale < 0 ||
          (pos.x - camera.x) * camera.scale > canvas.width ||
          (pos.y - camera.y) * camera.scale < 0 ||
          (pos.y - camera.y) * camera.scale > canvas.height)) {
        this.state.entities.splice(index, 1);
      }
    }
  }
}

export {System, MovSystem, CollSystem, CamDeathSystem};
