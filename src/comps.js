import {Vec} from './vec';
class Comp {
  constructor({name}) {
    this.name = name;
    if(this.name === undefined)
      throw new Error('requiredParam');
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
  constructor({image, visible, size}) {
    super({name: 'vis'});
    this.image = image;
    this.visible = visible || true;
    this.size = size || new Vec();
  }
}

class CollComp extends Comp {
  constructor({damage, coolTime}) {
    super({name: 'coll'});
    this.damage = damage || 0;
    this.coolTime = coolTime || 0;
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

class CamOutComp extends Comp {
  constructor({type}) {
    super({name: 'camOut'});
    this.type = type || CamOutComp.DESTROY;
  }
  static get NONE() {
    return 0;
  }
  static get DESTROY() {
    return 1;
  }
  static get BLOCK() {
    return 2;
  }
}

class TeamComp extends Comp {
  constructor({val}) {
    super({name: 'team'});
    this.val = val || 'DEFAULT';
  }
}

class ShootingComp extends Comp {
  constructor({enabled, coolTime, dir}) {
    super({name: 'shooting'});
    this.previousShoot = 0;
    this._enabled = enabled || false;
    this.coolTime = coolTime || 150;
    this.dir = dir;
  }
  set enabled(enabled) {
    this._enabled = enabled;
  }
  get enabled() {
    if(!this._enabled)
      return false;
    const currentShoot = Date.now();
    if(currentShoot - this.previousShoot > this.coolTime) {
      this.previousShoot = currentShoot;
      return true;
    }
    else
      return false;
  }
}

export {Comp, PosComp, MovComp, SizeComp, VisComp, CtrlComp, HpComp, CamOutComp, CollComp, TeamComp, ShootingComp};
