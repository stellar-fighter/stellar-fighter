import {CamOutComp, ShootingComp, PosComp, TeamComp} from './comps';
import {Bullet001} from './entities';

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
    for(let entity of Object.values(this.state.entities)) {
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
    super({state, compNames: ['coll', 'team', 'pos', 'size']});
  }
  process() {
    for(let entity1 of Object.values(this.state.entities)) {
      for(let entity2 of Object.values(this.state.entities)) {
        if(this.filter(entity1) &&
           this.filter(entity2) &&
           entity1.comps['team'].value != entity2.comps['team'].value &&
           CollSystem.checkColl(entity1, entity2)) {
          entity1.comps['hp'].value -= entity2.comps['coll'].damage;
          entity2.comps['hp'].value -= entity1.comps['coll'].damage;
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
    for(let entity of Object.values(this.state.entities)) {
      const camOut = entity.comps['camOut'];
      const pos = entity.comps['pos'];
      const size = entity.comps['size'];
      if(this.filter(entity) == true) {
        if(camOut.type == CamOutComp.DESTROY) {
          if((pos.x + size.width - camera.x) * camera.scale < 0 ||
             (pos.x - camera.x) * camera.scale > canvas.width ||
             (pos.y + size.height - camera.y) * camera.scale < 0 ||
             (pos.y - camera.y) * camera.scale > canvas.height) {
            this.state.entityMan.del(entity.id);
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

class HpSystem extends System {
  constructor({state, compNames}) {
    super({state, compNames: ['hp']});
  }
  process() {
    for(let entity of Object.values(this.state.entities)) {
      if(entity.comps['hp'].value <= 0)
        this.state.entityMan.del(entity.id);
    }
  }
}

class ShootingSystem extends System {
  constructor({state, compNames}) {
    super({state, compNames: ['shooting', 'pos', 'team']});
  }
  process() {
    for(let id in this.state.entities) {
      const entity = this.state.entities[id];
      const pos = entity.comps['pos'];
      const shooting = entity.comps['shooting'];
      const team = entity.comps['team'];
      if(this.filter(entity) && shooting.enabled) {
        this.state.entityMan.add(
          new Bullet001({
            state: this.state,
            comps: {
              pos: new PosComp({x: pos.x, y: pos.y}),
              team: new TeamComp({value: team.value})
            }
          })
        );
      }
    }
  }
}

export {System, MovSystem, CollSystem, CamOutSystem, HpSystem, ShootingSystem};
