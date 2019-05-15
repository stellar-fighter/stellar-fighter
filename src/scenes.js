class SceneNode {
  constructor({name, state, children}) {
    this.name = name;
    if(this.name === undefined)
      throw new Error('RequiredParam');
    this.state = state;
    this.children = children || {};
    this.valid = true;
  }
  get valid() {
    if(this._valid === undefined)
      return true;
    return this._valid;
  }
  set valid(valid) {
    if(this._valid === undefined || this._valid == true)
      this._valid = valid;
  }
  addChild(child) {
    this.children[child.name] = child;
  }
  delChild(name) {
    delete this.children[name];
  }
  drawSelf() {}
  draw() {
    this.drawSelf();
    for(let name in this.children) {
      const child = this.children[name];
      if(child.valid)
        child.draw();
      else
        this.delChild(child.name);
    }
  }
}

export {SceneNode};
