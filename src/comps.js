import {Vec} from './vec';

/**
 * A super component class that defines components name
 */
class Comp {
  /**
   * Create a new Comp
   * @param {string} name - The component name parameter
   */
  constructor({name}) {
    if(name === undefined)
      throw new Error('requiredParam');
    this.name = name;
  }
}

/**
 * A component related to vector and abs out of entities
 * @extends Comp
 */
class PosComp extends Comp {
  /**
   * Create a new PosComp
   * @param {Object} vec - The vector object
   * @param {boolean} abs - The abs boolean value
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
 * @extends Comp
 */
class MovComp extends Comp {
  /**
   * Create a new MovComp
   * @param {Object} vel - The velocity vector object
   * @param {Object} acc - The acceleration vector object
   */
  constructor({vel, acc}) {
    super({name: 'mov'});
    this.vel = vel || new Vec();
    this.acc = acc || new Vec();
  }
}

/**
 * A component related to entities' size
 * @extends Comp
 */
class SizeComp extends Comp {
  /**
   * Create a new SizeComp
   * @param {Object} vec - The vector object about entitiy's size
   */
  constructor({vec}) {
    super({name: 'size'});
    this.vec = vec || new Vec();
  }
}

/**
 * A component related to entities' visibility
 * @extends Comp
 */
class VisComp extends Comp {
  /**
   * Create a new VisComp
   * @param {Object} sn - The Sprite object
   * @param {Object} visible - The visible boolean value
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
 * @extends Comp
 */
class CollComp extends Comp {
  /**
   * Create a new CollComp
   * @param {int} damage - The damage of entity collision
   * @param {Object} timer - The timer object for damage cooltime
   * @param {int} coolTime - The damage cooltime
   * @param {boolean} enabled - The ability for damage
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
 * @extends Comp
 */
class CtrlComp extends Comp {
  /**
   * Create a new CtrlComp
   */
  constructor() {
    super({name: 'ctrl'});
  }
}

/**
 * A component related to entities' HP
 * @extends Comp
 */
class HpComp extends Comp {
  /**
   * Create a new HpComp
   * @param {int} val - The HP of entity
   */
  constructor({val}) {
    super({name: 'hp'});
    this.val = val || 1;
  }
}

/**
 * A component related to camera out of entities
 * @extends Comp
 */
class CamOutComp extends Comp {
  /**
   * Create a new CamOutComp
   * @param {Object} actions - The conditions and actions; keys: UP, DOWN, LEFT, RIGHT, values: NONE, DESTROY, BLOCK, BOUNCE
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
 * @extends Comp
 */
class TeamComp extends Comp {
  /**
   * Create a new TeamComp
   * @param {string} val - The team of entity
   */
  constructor({val}) {
    super({name: 'team'});
    this.val = val || 'DEFAULT';
  }
}

/**
 * A component related to entities' shooting action
 * @extends Comp
 */
class ShootingComp extends Comp {
  /**
   * Create a new ShootingComp
   * @param {boolean} enabled - The ability to shoot
   * @param {Object} timer - The timer object of entity
   * @param {int} coolTime - The interval between continuous shooting
   * @param {Object} power - The Vector object of moving shooted bullet
   * @param {string} sound - The sound effect of shooting action
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
 * @extends Comp
 */
class ScoreComp extends Comp {
  /**
   * Create a new ScoreComp
   * @param {int} score - The score of entity
   */
  constructor({score}) {
    super({name: 'score'});
    this.score = score;
  }
}

export {Comp, PosComp, MovComp, SizeComp, VisComp, CtrlComp, HpComp, CamOutComp, CollComp, TeamComp, ShootingComp, ScoreComp};
