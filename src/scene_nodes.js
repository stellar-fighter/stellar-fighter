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
    if(this.pos !== null && this.size !== null)
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
    ctx.setTransform(
      camera.scale, 0,
      0, camera.scale,
      0, 0
    );
    ctx.beginPath();
    ctx.rect(
      (pos.x - camera.pos.x),
      (pos.y - camera.pos.y),
      size.x,
      size.y
    );
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
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
    ctx.setTransform(
      camera.scale, 0,
      0, camera.scale,
      0, 0
    );
    ctx.beginPath();
    ctx.fillStyle = '#00FF00';
    ctx.font = '' + (300 * camera.scale) + 'px Arial';
    ctx.fillText(
      hp.val,
      pos.vec.x - camera.pos.x,
      pos.vec.y - camera.pos.y
    );
    ctx.closePath();
    ctx.restore();
  }
}

export {SceneNode, HpDisplay};
