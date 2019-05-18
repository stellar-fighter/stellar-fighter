class SceneNode {
  constructor({name, ctx, pos, size, children}) {
    this.name = name || null;
    if(ctx === undefined)
      throw new Error('RequiredParam');
    this.ctx = ctx;
    if(pos === undefined)
      throw new Error('RequiredParam');
    this.pos = pos;
    if(size === undefined)
      throw new Error('RequiredParam');
    this.size = size;
    //this.children = children || {};
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
    child.ctx = this.ctx;
    //this.children[child.name] = child;
  }
  delChild(name) {
    delete this.children[name];
  }
  drawSelf() {}
  draw() {
    this.drawSelf();
    for(let name in this.children) {
      const child = this.children[name];
      if(child.alive)
        child.draw();
      else
        this.delChild(child.name);
    }
  }
}

export {SceneNode};
