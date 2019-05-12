class Comp {
  constructor({name}) {
    this.name = name;
  }
}

class PosComp extends Comp {
  constructor({x, y, abs}) {
    super({name: 'pos'});
    this.x = x || 0;
    this.y = y || 0;
    this.abs = abs || false;
  }
}

class MovComp extends Comp {
  constructor({velX, velY, accX, accY}) {
    super({name: 'mov'});
    this.velX = velX || 0;
    this.velY = velY || 0;
    this.accX = accX || 0;
    this.accY = accY || 0;
  }
}

class SizeComp extends Comp {
  constructor({width, height}) {
    super({name: 'size'});
    this.width = width || 0;
    this.height = height || 0;
  }
}

class VisComp extends Comp {
  constructor({image, visible, width, height}) {
    super({name: 'vis'});
    this.image = image;
    this.visible = visible || true;
    this.width = width || 0;
    this.height = height || 0;
  }
}

class CollComp extends Comp {
  constructor({damage}) {
    super({name: 'coll'});
    this.damage = damage || 0;
  }
}

class CtrlComp extends Comp {
  constructor() {
    super({name: 'ctrl'});
  }
}

class HpComp extends Comp {
  constructor({value}) {
    super({name: 'hp'});
    this.value = value || 1;
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
  constructor({value}) {
    super({name: 'team'});
    this.value = value || 'DEFAULT';
  }
}

class ShootingComp extends Comp {
  constructor({coolTime}) {
    super({name: 'shooting'});
    this.previousShoot = 0;
    this.coolTime = coolTime || 150;
  }
  get enabled() {
    let currentShoot = new Date().getTime();
    if (currentShoot - this.previousShoot > this.coolTime) {
      this.previousShoot = currentShoot;
      return true;
    }
    else {
      return false;
    } 
  }
}

export {Comp, PosComp, MovComp, SizeComp, VisComp, CtrlComp, HpComp, CamOutComp, CollComp, TeamComp, ShootingComp};
