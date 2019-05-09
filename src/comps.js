class Comp {
  constructor({name}) {
    this.name = name;
  }
}

class PosComp extends Comp {
  constructor({x, y}) {
    super({name: 'pos'});
    this.x = x || 0;
    this.y = y || 0;
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
  constructor({enabled}) {
    super({name: 'coll'});
    this.enabled = enabled || true;
  }
}

class CtrlComp extends Comp {
  constructor({enabled}) {
    super({name: 'ctrl'});
    this.enabled = enabled || false;
  }
}

class HpComp extends Comp {
  constructor({value}) {
    super({name: 'hp'});
    this.value = value || 1;
  }
}

export {Comp, PosComp, MovComp, SizeComp, VisComp};
