/**
 * A super SceneNode class that defines scene
 */
class SceneNode {
  /**
   * Create a new SceneNode object
   * @param {Object} transform - not implemented yet
   * @param {Object} pos - The Vector object for entity's pos
   * @param {Object} size - The Vector object for entity's size
   * @param {Object[]} children - The array of childeren SceneNode object
   * @param {Object} render - The render method for this object
   */
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
  /**
  * Render all SceneNode object in children array
   * @param {Object} canvas - The main canvas to show visual part in game
   * @param {Object} ctx - The 2D context of main canvas
   * @param {Object} camera - The Camera object of main canvas
  */
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
  /**
  * Render as SceneNode class default rendering
   * @param {Object} self - The SceneNode object itself
   * @param {Object} canvas - The main canvas to show visual part in game
   * @param {Object} ctx - The 2D context of main canvas
   * @param {Object} camera - The Camera object of main canvas
  */
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

/**
 * A SceneNode related to entity's visibility
 * @extends SceneNode
 */
class Sprite extends SceneNode {
  /**
   * Create a new Sprite object
   * @param {Object} pos - The Vector object for entity's pos
   * @param {Object} size - The Vector object for entity's size
   * @param {Object[]} children - The array of childeren SceneNode object
   * @param {function} render - The render method for this object
   * @param {Image} texture - The texture image of entity
   */
  constructor({pos, size, children, render, texture}) {
    super({
      pos, size, children,
      render: (render || Sprite.defaultRender)
    });
    if(texture === undefined)
      throw new Error('RequiredParam');
    this.texture = texture;
  }
  /**
  * Render as Sprite class default rendering
   * @param {Object} self - The Sprite object itself
   * @param {Object} canvas - The main canvas to show visual part in game
   * @param {Object} ctx - The 2D context of main canvas
   * @param {Object} camera - The Camera object of main canvas
  */
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
    /*
    ctx.strokeStyle = 'red';
    ctx.strokeRect(
      camera.toRealX(pos.x),
      camera.toRealY(pos.y),
      camera.toRealW(size.x),
      camera.toRealH(size.y)
    );
    */
    ctx.restore();
  }
}

/**
 * A SceneNode related to game's background
 * @extends SceneNode
 */
class Background extends SceneNode {
  /**
   * Create a new Background object
   * @param {Object[]} children - The array of childeren SceneNode object
   * @param {Image} texture - The texture image of background
   */
  constructor({children, texture}) {
    super({
      children,
      render: (Background.defaultRender)
    });
    if(texture === undefined)
      throw new Error('RequiredParam');
    this.texture = texture;
  }
  /**
  * Render as Background class default rendering
   * @param {Object} self - The Background object itself
   * @param {Object} canvas - The main canvas to show background in game
   * @param {Object} ctx - The 2D context of main canvas
   * @param {Object} camera - The Camera object of main canvas
  */
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

/**
 * A SceneNode related to displaying current score
 * @extends SceneNode
 */
class ScoreDisplay extends SceneNode {
  /**
   * Create a new Background object
   * @param {Object} state - The state object related to current game
   */
  constructor({state}) {
    super({
      render: (ScoreDisplay.defaultRender)
    });
    this.state = state;
  }
  /**
  * Render as ScoreDisplay class default rendering
   * @param {Object} self - The ScoreDisplay object itself
   * @param {Object} canvas - The main canvas to show score in game
   * @param {Object} ctx - The 2D context of main canvas
   * @param {Object} camera - The Camera object of main canvas
  */
  static defaultRender({self, canvas, ctx, camera}) {
    const {texture} = self;
    if(!ctx)
      return;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '' + (150 * camera.xScale) + 'px Arial';
    ctx.fillText(this.state.score, 100 * camera.xScale, 200 * camera.yScale);
  }
}

/**
 * A SceneNode related to displaying current HP of entity
 * @extends SceneNode
 */
class HpDisplay extends SceneNode {
  /**
   * Create a new Sprite object
   * @param {Object} pos - The Vector object for entity's pos
   * @param {Object} size - The Vector object for entity's size
   * @param {Object[]} children - The array of childeren SceneNode object
   * @param {int} hp - The hp of entity
   */
  constructor({pos, size, children, hp}) {
    super({
      pos, size, children,
      render: HpDisplay.defaultRender
    });
    if(hp === undefined)
      throw new Error('RequiredParam');
    this.hp = hp;
  }
  /**
  * Render as HpDisplay class default rendering
   * @param {Object} self - The HpDisplay object itself
   * @param {Object} canvas - The main canvas to show HP in game
   * @param {Object} ctx - The 2D context of main canvas
   * @param {Object} camera - The Camera object of main canvas
  */
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
