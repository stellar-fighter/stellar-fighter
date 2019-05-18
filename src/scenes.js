class SceneNode {
  constructor({name, canvas, ctx, camera, layer, pos, size, children, render, image}) {
    this.name = name || null;
    if(canvas === undefined)
      throw new Error('RequiredParam');
    this.canvas = canvas;

    if(ctx === undefined)
      throw new Error('RequiredParam');
    this.ctx = ctx;

    if(camera === undefined)
      throw new Error('RequiredParam');
    this.camera = camera;

    if(pos === undefined)
      throw new Error('RequiredParam');
    this.pos = pos;

    if(size === undefined)
      throw new Error('RequiredParam');
    this.size = size;

    this.layer = layer || 0;
    this.children = children || [];
    this.render = render || ((self) => {});
    this.alive = true;
  }
  addChild(child) {
    child.ctx = this.ctx;
    this.children.push(child);
  }
  renderChildren() {
    this.render(this);
    for(let name in this.children) {
      const child = this.children[name];
      if(child.alive)
        child.renderChildren();
      else
        this.delChild(child.name);
    }
  }
}
/*
class SceneMan {
  constructor({canvas, ctx, camera, sn}) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.camera = camera;
    this.sn = sn;
  }
  create({pos, size, children, render}) {
    return new SceneNode({canvas: this.canvas, ctx: this.ctx, camera: this.camera, pos, size, children, render});
  }
  render() {
    this.sn.render(this.sn);
  }
}
*/
export {SceneNode};
