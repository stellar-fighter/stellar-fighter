class SceneNode {
  constructor({transform, pos, size, children, render}) {
    this.transform = transform; // not implemented yet
    this.pos = pos || null;
    this.size = size || null;
    this.render = render || SceneNode.defaultRender;
    this.children = children || [];
    this.alive = true;
  }
  get alive() {
    if(this._alive === undefined)
      return true;
    return this._alive;
  }
  set alive(alive) {
    if(this._alive === undefined || this._alive == true)
      this._alive = alive;
  }
  addChild(child) {
    this.children.push(child);
  }
  renderAll({canvas, ctx, camera}) {
    this.render({self: this, canvas, ctx, camera});
    const newChildren = [];
    for(let child of this.children) {
      if(child.alive) {
        newChildren.push(child);
        child.renderAll({canvas, ctx, camera});
      }
    }
    this.children = newChildren;
  }
  static defaultRender({self, canvas, ctx, camera}) {
    const {pos, size} = self;
    if(!(ctx && camera && pos && size))
      return;
    ctx.save();
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.rect(
      camera.toRealX(pos.x),
      camera.toRealY(pos.y),
      size.x,
      size.y
    );
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}

class Sprite extends SceneNode {
  constructor({pos, size, children, render, texture}) {
    super({
      pos, size, children,
      render: (render || Sprite.defaultRender)
    });
    if(texture === undefined)
      throw new Error('RequiredParam');
    this.texture = texture;
  }
  static defaultRender({self, canvas, ctx, camera}) {
    const {pos, size, texture} = self;
    if(!(ctx && camera && pos && size))
      return;
    ctx.save();
    ctx.drawImage(
      texture,
      camera.toRealX(pos.x),
      camera.toRealY(pos.y),
      camera.toRealW(size.x),
      camera.toRealH(size.y)
    );
    ctx.beginPath();
    /*ctx.rect(
      (pos.x - camera.pos.x),
      (pos.y - camera.pos.y),
      size.x,
      size.y
    );*/
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}

class Background extends SceneNode {
  constructor({children, texture}) {
    super({
      children,
      render: (Background.defaultRender)
    });
    if(texture === undefined)
      throw new Error('RequiredParam');
    this.texture = texture;
  }
  static defaultRender({self, canvas, ctx, camera}) {
    const {texture} = self;
    if(!(ctx && camera))
      return;
    ctx.save();
    ctx.drawImage(this.texture, camera.toRealX(0), camera.toRealY(Math.floor(Math.abs(camera.pos.y) / camera.absH) * -camera.absH), camera.realW, camera.realH); // TODO: remove hardcoded numbers
    ctx.drawImage(this.texture, camera.toRealX(0), camera.toRealY((Math.floor(Math.abs(camera.pos.y) / camera.absH) + 1) * -camera.absH), camera.realW, camera.realH);
    ctx.restore();
  }
}

class ScoreDisplay extends SceneNode {
  constructor({children, state}) {
    super({
      children,
      render: (ScoreDisplay.defaultRender)
    });
    this.state = state;
  }
  static defaultRender({self, canvas, ctx, camera}) {
    const {texture} = self;
    if(!ctx)
      return;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '' + (150 * camera.xScale) + 'px Arial';
    ctx.fillText(this.state.score, 100 * camera.xScale, 200 * camera.yScale);
  }
}

class HpDisplay extends SceneNode {
  constructor({pos, size, children, hp}) {
    super({
      pos, size, children,
      render: HpDisplay.defaultRender
    });
    if(hp === undefined)
      throw new Error('RequiredParam');
    this.hp = hp;
  }
  static defaultRender({self, canvas, ctx, camera}) {
    const {pos, size, hp} = self;
    if(!(canvas && ctx && camera && pos && size && hp))
      return;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = '#00FF00';
    ctx.font = camera.toRealW(100) + 'px Arial';
    ctx.fillText(
      hp.val,
      camera.toRealX(pos.vec.x),
      camera.toRealY(pos.vec.y)
    );
    ctx.closePath();
    ctx.restore();
  }
}

export {SceneNode, Sprite, Background, HpDisplay, ScoreDisplay};
