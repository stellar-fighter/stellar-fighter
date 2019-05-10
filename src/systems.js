import {CamOutComp} from './comps';

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

class CamOutSystem extends System {
  constructor({state, compNames}) {
    super({state, compNames: ['camOut', 'pos', 'size']});
  }
  process() {
    const camera = this.state.camera;
    const canvas = this.state.canvas;
    for(let index = this.state.entities.length - 1; index >= 0; --index) {
      let entity = this.state.entities[index];
      let camOut = entity.comps['camOut'];
      let pos = entity.comps['pos'];
      let size = entity.comps['size'];
      if(this.filter(entity) == true && camOut) {
        if(camOut.type == CamOutComp.DESTROY) {
          if((pos.x + size.width - camera.x) * camera.scale < 0 ||
             (pos.x - camera.x) * camera.scale > canvas.width ||
             (pos.y + size.height - camera.y) * camera.scale < 0 ||
             (pos.y - camera.y) * camera.scale > canvas.height) {
            this.state.entities.splice(index, 1);
          }
        } else if(camOut.type == CamOutComp.BLOCK) {
          if((pos.x - camera.x) * camera.scale < 0)
            pos.x = camera.x;
          if((pos.x + size.width - camera.x) * camera.scale > canvas.width)
            pos.x = (canvas.width / camera.scale) - size.width + camera.x;
          if((pos.y - camera.y) * camera.scale < 0)
            pos.y = camera.y;
          if((pos.y + size.height - camera.y) * camera.scale > canvas.height)
            pos.y = (canvas.height / camera.scale) - size.height + camera.y;
        }
      }
    }
  }
}

export {System, MovSystem, CollSystem, CamOutSystem};
