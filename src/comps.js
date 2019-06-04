import {Vec} from './vec';

class Comp {
  constructor({name}) {
    if(name === undefined)
      throw new Error('requiredParam');
    this.name = name;
  }
}

class PosComp extends Comp {
  constructor({vec, abs}) {
    super({name: 'pos'});
    this.vec = vec || new Vec();
    this.abs = abs;
    if(this.abs === undefined)
      this.abs = false;
  }
}

class MovComp extends Comp {
  constructor({vel, acc}) {
    super({name: 'mov'});
    this.vel = vel || new Vec();
    this.acc = acc || new Vec();
  }
}

class SizeComp extends Comp {
  constructor({vec}) {
    super({name: 'size'});
    this.vec = vec || new Vec();
  }
}

class VisComp extends Comp {
  constructor({sn, visible}) {
    super({name: 'vis'});
    this.visible = visible || true;
    if(sn === undefined)
      throw new Error('RequiredParam');
    this.sn = sn;
  }
}

class CollComp extends Comp {
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

class CtrlComp extends Comp {
  constructor() {
    super({name: 'ctrl'});
  }
}

class HpComp extends Comp {
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

class TeamComp extends Comp {
  constructor({val}) {
    super({name: 'team'});
    this.val = val || 'DEFAULT';
  }
}

class ShootingComp extends Comp {
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

class ScoreComp extends Comp {
  constructor({score}) {
    super({name: 'score'});
    this.score = score;
  }
}

export {Comp, PosComp, MovComp, SizeComp, VisComp, CtrlComp, HpComp, CamOutComp, CollComp, TeamComp, ShootingComp, ScoreComp};
