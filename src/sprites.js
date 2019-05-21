import {SceneNode} from './scene_nodes';

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

export {Sprite};
