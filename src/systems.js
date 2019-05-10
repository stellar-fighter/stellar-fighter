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
        const mov = entity.comps['mov'];
        const pos = entity.comps['pos'];
        mov.velX += mov.accX;
        mov.accX = 0;
        mov.velY += mov.accY;
        mov.accY = 0;
        pos.x += mov.velX;
        pos.y += mov.velY;
      }
    }
  }
}

class CollSystem extends System {
  static checkColl(entity1, entity2) {
    const pos1 = entity1.comps['pos'];
    const size1 = entity1.comps['size'];
    const pos2 = entity2.comps['pos'];
    const size2 = entity2.comps['size'];
    return (pos1.x + size1.width > pos2.x &&
            pos2.x + size2.width > pos1.x &&
            pos1.y + size1.height > pos2.y &&
            pos2.y + size2.height > pos1.y);
  }
  constructor({state, compNames}) {
    super({state, compNames: ['pos', 'size']});
  }
  process() {
    for(let i = this.state.entities.length - 1; i >= 1; --i) {
      let entity1 = this.state.entities[i];
      if(this.filter(entity1)) {
        for(let j = i - 1; j >= 0; --j) {
          let entity2 = this.state.entities[j];
          if(this.filter(entity2)) {
            if(CollSystem.checkColl(entity1, entity2)) {
              entity1.comps['size'].width = 100;
              entity2.comps['size'].width = 100;
              entity1.comps['size'].height = 100;
              entity2.comps['size'].height = 100;
            }
          }
        }
      }
    }
  }
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
      if(this.filter(entity) == true) {
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
