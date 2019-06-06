import {Vec} from './vec';

/**
 * A super component class that defines components name
 */
class Comp {
  /**
   * Returns a new Comp
   * @param {string} name - component name parameter
   */
  constructor({name}) {
    if(name === undefined)
      throw new Error('requiredParam');
    this.name = name;
  }
}

/**
 * A component related to vector and abs out of entities
 */
class PosComp extends Comp {
  /**
   * Returns a new PosComp
   * @param {Object} vec - mappings of vector object
   * @param {boolean} abs - mappings of abs boolean value
   */
  constructor({vec, abs}) {
    super({name: 'pos'});
    this.vec = vec || new Vec();
    this.abs = abs;
    if(this.abs === undefined)
      this.abs = false;
  }
}

/**
 * A component related to entities' movement
 */
class MovComp extends Comp {
  /**
   * Returns a new MovComp
   * @param {Object} vel - mappings of velocity vector object
   * @param {Object} acc - mappings of acceleration vector object
   */
  constructor({vel, acc}) {
    super({name: 'mov'});
    this.vel = vel || new Vec();
    this.acc = acc || new Vec();
  }
}

/**
 * A component related to entities' size
 */
class SizeComp extends Comp {
  /**
   * Returns a new SizeComp
   * @param {Object} vec - mappings of vector object about entitiy's size
   */
  constructor({vec}) {
    super({name: 'size'});
    this.vec = vec || new Vec();
  }
}

/**
 * A component related to entities' visibility
 */
class VisComp extends Comp {
  /**
   * Returns a new VisComp
   * @param {Object} sn - mappings of Sprite object
   * @param {Object} visible - mappings of visible boolean value
   */
  constructor({sn, visible}) {
    super({name: 'vis'});
    this.visible = visible || true;
    if(sn === undefined)
      throw new Error('RequiredParam');
    this.sn = sn;
  }
}

/**
 * A component related to entities' collision
 */
class CollComp extends Comp {
  /**
   * Returns a new CollComp
   * @param {int} damage - mappings of damage of entity collision
   * @param {Object} timer - mappings of timer object for damage cooltime
   * @param {int} coolTime - mappings of damage cooltime
   * @param {boolean} enabled - mappings of ability for damage
   */
  constructor({damage, timer, coolTime, enabled}) {
    super({name: 'coll'});
    this.damage = damage || 0;
    this.timer = timer;
    if(this.timer === undefined)
      throw new Error('RequiredParam');
    this.prevTime = 0;
    this.coolTime = coolTime || 150;
    this._enabled = enabled || true;
  }
  set enabled(enabled) {
    this._enabled = enabled;
  }
  get enabled() {
    if(!this._enabled || this.timer.current - this.prevTime <= this.coolTime)
      return false;
    else {
      this.prevTime = this.timer.current;
      return true;
    }
  }
}
/**
 * A component related to entities' control
 */
class CtrlComp extends Comp {
  /**
   * Returns a new CtrlComp
   */
  constructor() {
    super({name: 'ctrl'});
  }
}

/**
 * A component related to entities' HP
 */
class HpComp extends Comp {
  /**
   * Returns a new HpComp
   * @param {int} val - mappings of HP of entity
   */
  constructor({val}) {
    super({name: 'hp'});
    this.val = val || 1;
  }
}

/**
 * A component related to camera out of entities
 */
class CamOutComp extends Comp {
  /**
   * Returns a new CamOutComp
   * @param {Object} actions - mappings of conditions and actions; keys: UP, DOWN, LEFT, RIGHT, values: NONE, DESTROY, BLOCK, BOUNCE
   */
  constructor({actions}) {
    super({name: 'camOut'});
    this.actions = {
      UP: 'NONE',
      DOWN: 'DESTROY',
      LEFT: 'DESTROY',
      RIGHT: 'DESTROY'
    };
    for(let cond in actions)
      this.actions[cond] = actions[cond];
  }
}

/**
 * A component related to entities' Team
 */
class TeamComp extends Comp {
  /**
   * Returns a new TeamComp
   * @param {string} val - mappings of Team of entity
   */
  constructor({val}) {
    super({name: 'team'});
    this.val = val || 'DEFAULT';
  }
}

/**
 * A component related to entities' shooting action
 */
class ShootingComp extends Comp {
  /**
   * Returns a new ShootingComp
   * @param {boolean} enabled - mappings of ability to shoot
   * @param {Object} timer - mappings of timer object of entity
   * @param {int} coolTime - mappings of interval between continuous shooting
   * @param {Object} power - mappings of Vector object of moving shooted bullet
   * @param {string} sound - mappings of sound effect of shooting action
   */
  constructor({enabled, timer, coolTime, power, sound}) {
    super({name: 'shooting'});
    this.timer = timer;
    if(this.timer === undefined)
      throw new Error('RequiredParam');
    this.prevTime = 0;
    this.coolTime = coolTime || 150;
    this._enabled = enabled || false;
    this.power = power || new Vec(0, 0);
    this.sound = sound || null;
  }
  set enabled(enabled) {
    this._enabled = enabled;
  }
  get enabled() {
    if(!this._enabled || this.timer.current - this.prevTime <= this.coolTime)
      return false;
    else {
      this.prevTime = this.timer.current;
      return true;
    }
  }
}

/**
 * A component related to entities' score
 */
class ScoreComp extends Comp {
  /**
   * Returns a new ScoreComp
   * @param {int} score - mappings of score of entity
   */
  constructor({score}) {
    super({name: 'score'});
    this.score = score;
  }
}

export {Comp, PosComp, MovComp, SizeComp, VisComp, CtrlComp, HpComp, CamOutComp, CollComp, TeamComp, ShootingComp, ScoreComp};
