import {CamOutComp, ShootingComp, PosComp, TeamComp} from './comps';
import {Bullet001} from './entities';
import {Vec} from './vec';

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
        mov.vel.x += mov.acc.x;
        mov.acc.x = 0;
        mov.vel.y += mov.acc.y;
        mov.acc.y = 0;
        pos.vec.x += mov.vel.x;
        pos.vec.y += mov.vel.y;
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
    return (pos1.vec.x + size1.vec.x > pos2.vec.x &&
            pos2.vec.x + size2.vec.x > pos1.vec.x &&
            pos1.vec.y + size1.vec.y > pos2.vec.y &&
            pos2.vec.y + size2.vec.y > pos1.vec.y);
  }
  constructor({state, compNames}) {
    super({state, compNames: ['coll', 'team', 'pos', 'size']});
  }
  process() {
    for(let entity1 of Object.values(this.state.entities)) {
      for(let entity2 of Object.values(this.state.entities)) {
        if(this.filter(entity1) &&
           this.filter(entity2) &&
           entity1.comps['team'].val != entity2.comps['team'].val &&
           CollSystem.checkColl(entity1, entity2)) {
          entity1.comps['hp'].val -= entity2.comps['coll'].damage;
          entity2.comps['hp'].val -= entity1.comps['coll'].damage;
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
          if((pos.vec.x + size.vec.x - camera.pos.x) * camera.scale < 0 ||
             (pos.vec.x - camera.pos.x) * camera.scale > canvas.width ||
             (pos.vec.y + size.vec.y - camera.pos.y) * camera.scale < 0 ||
             (pos.vec.y - camera.pos.y) * camera.scale > canvas.height) {
            this.state.entityMan.del(entity.id);
          }
        } else if(camOut.type == CamOutComp.BLOCK) {
          if((pos.vec.x - camera.pos.x) * camera.scale < 0)
            pos.vec.x = camera.pos.x;
          if((pos.vec.x + size.vec.x - camera.pos.x) * camera.scale > canvas.width)
            pos.vec.x = (canvas.width / camera.scale) - size.vec.x + camera.pos.x;
          if((pos.vec.y - camera.pos.y) * camera.scale < 0)
            pos.vec.y = camera.pos.y;
          if((pos.vec.y + size.vec.y - camera.pos.y) * camera.scale > canvas.height)
            pos.vec.y = (canvas.height / camera.scale) - size.vec.y + camera.pos.y;
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
      if(entity.comps['hp'].val <= 0)
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
              pos: new PosComp({
                vec: new Vec(pos.vec.x, pos.vec.y)
              }),
              team: new TeamComp({val: team.val})
            }
          })
        );
      }
    }
  }
}

export {System, MovSystem, CollSystem, CamOutSystem, HpSystem, ShootingSystem};
