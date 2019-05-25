import {CamOutComp, ShootingComp, PosComp, TeamComp} from './comps';
import {Bullet001} from './entities';
import {Vec} from './vec';

/**
 * A class that handles entities and components
 */
class System {
  constructor({state, compNames}) {
    if(state === undefined)
      throw new Error('RequiredParam');
    this.state = state;
    this.compNames = compNames || [];
  }
  /**
   * Filters entities by their components
   */
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

/**
 * A class that handles movements
 */
class MovSystem extends System {
  constructor({state, compNames}) {
    super({state, compNames: ['pos', 'mov']});
  }
  process() {
    for(let id in this.state.entities) {
      const entity = this.state.entities[id];
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

/**
 * A class that handles collisions
 */
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
    for(let id1 in this.state.entities) {
      const entity1 = this.state.entities[id1];
      for(let id2 in this.state.entities) {
        const entity2 = this.state.entities[id2];
        if(id1 != id2 &&
           this.filter(entity1) &&
           this.filter(entity2) &&
           entity1.comps['team'].val != entity2.comps['team'].val &&
           CollSystem.checkColl(entity1, entity2)) {
          if(entity1.comps['coll'].enabled)
            entity2.comps['hp'].val -= entity1.comps['coll'].damage;
          if(entity2.comps['coll'].enabled)
            entity1.comps['hp'].val -= entity2.comps['coll'].damage;
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
    for(let id in this.state.entities) {
      const entity = this.state.entities[id];
      const camOut = entity.comps['camOut'];
      const pos = entity.comps['pos'];
      const size = entity.comps['size'];
      if(this.filter(entity) == true) {
        if(entity.name == "alien002") {
          const pivot = 15 * entity.direction;
          const pivot2 = 30 * entity.directionY;
          pos.vec.y += pivot2;
          pos.vec.x += pivot;
          if((pos.vec.y + size.vec.y - camera.pos.y) * camera.scale < 10) {
            entity.directionY = 1;
          }
          if((pos.vec.y - camera.pos.y) * camera.scale > canvas.height - 50) {
            entity.directionY = -2;
          }
          if((pos.vec.x + size.vec.x - camera.pos.x) * camera.scale < 10) {
            entity.direction *= -1;
          }
          if((pos.vec.x - camera.pos.x) * camera.scale > canvas.width - 10) {
            entity.direction *= -1;
          }
        }
        if(entity.name == "item001") {
          pos.vec.y -= 10 + 10 * Math.sin(Date.now());
          const pivot = 15 * entity.direction;
          pos.vec.x += pivot;
          if((pos.vec.x + size.vec.x - camera.pos.x) * camera.scale < 10) {
            entity.direction *= -1;
          }
          if((pos.vec.x - camera.pos.x) * camera.scale > canvas.width - 10) {
            entity.direction *= -1;
          }
        }
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
    for(let id in this.state.entities) {
      const entity = this.state.entities[id];
      if(entity.comps['hp'].val <= 0)
        this.state.entityMan.del(entity.id);
    }
  }
}

class ShootingSystem extends System {
  constructor({state, compNames}) {
    super({state, compNames: ['shooting', 'pos', 'size', 'team']});
  }
  process() {
    for(let id in this.state.entities) {
      const entity = this.state.entities[id];
      const {pos, size, shooting, team} = entity.comps;
      if(this.filter(entity) && shooting.enabled) {
        const bullet = new Bullet001({
          state: this.state,
          comps: {
            team: new TeamComp({val: team.val}),
            pos: new PosComp({
              vec: new Vec(
                pos.vec.x + size.vec.x / 2 - Bullet001.defaultSize.x / 2,
                pos.vec.y + size.vec.y / 2 - Bullet001.defaultSize.y / 2
              )
            })
          }
        });
        if(shooting.sound) {
          if(shooting.sound.paused)
            shooting.sound.play();
          shooting.sound.currentTime = 0;
        }
        const {mov, vis} = bullet.comps;
        mov.vel.setVec(Vec.fromVec(shooting.power).mult(mov.vel.mag));
        this.state.scene.children[0].addChild(vis.sn);
        this.state.entityMan.add(bullet);
      }
    }
  }
}

class PlayerSystem extends System {
  constructor({state, compNames}) {
    super({state, compNames: ['player']});
  }
  process() {
    const player = this.state.entityMan.get(this.state.playerId);
    if (player) {
      const pos = player.comps['pos'];
      if(this.state.event.ArrowUp)
        pos.vec.y -= 30;
      if(this.state.event.ArrowDown)
        pos.vec.y += 30;
      if(this.state.event.ArrowLeft)
        pos.vec.x -= 30;
      if(this.state.event.ArrowRight)
        pos.vec.x += 30;
    }
  }
}

export {System, MovSystem, CollSystem, CamOutSystem, HpSystem, ShootingSystem, PlayerSystem};
