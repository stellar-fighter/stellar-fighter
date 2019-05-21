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
    ctx.setTransform(
      camera.scale, 0,
      0, camera.scale,
      0, 0
    );
    ctx.drawImage(
      texture,
      (pos.x - camera.pos.x),
      (pos.y - camera.pos.y),
      size.x,
      size.y
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
    /*
    ctx.setTransform(
      camera.scale, 0,
      0, camera.scale,
      0, 0
    );
    */
    ctx.drawImage(this.texture, 0, (Math.floor(Math.abs(camera.pos.y) / 4000) * -4000 - camera.pos.y) * camera.scale, 3000 * camera.scale, 4000 * camera.scale); // TODO: remove hardcoded numbers
    ctx.drawImage(this.texture, 0, ((Math.floor(Math.abs(camera.pos.y) / 4000) + 1) * -4000 - camera.pos.y) * camera.scale, 3000 * camera.scale, 4000 * camera.scale);
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

export {SceneNode, Sprite, Background, HpDisplay};
