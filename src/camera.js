import {Vec} from './vec';
class Camera {
  constructor({canvas, pos, absSize}) {
    if(canvas === undefined)
      throw new Error('RequiredParam');
    this.canvas = canvas;
    this.pos = pos || new Vec();
    this.absSize = absSize || new Vec(3000, 4000);
  }
  get scale() {
    return this.canvas.width / this.absSize.x;
  }
  get absWidth() {
    return this.absSize.x;
  }
  get absHeight() {
    return this.absSize.y;
  }
  get realWidth() {
    return this.absSize.x * this.scale;
  }
  get realHeight() {
    return this.absSize.y * this.scale;
  }
  toRealX(absX) {
    return (absX - this.pos.x) * this.scale;
  }
  toRealY(absY) {
    return (absY - this.pos.y) * this.scale;
  }
  toRealMag(absMag) {
    return absMag * this.scale;
  }
  toAbsX(realX) {
    return (realX / this.scale) + this.pos.x;
  }
  toAbsY(realY) {
    return (realY / this.scale) + this.pos.y;
  }
}

export {Camera};
