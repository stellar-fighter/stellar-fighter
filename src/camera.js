import {Vec} from './vec';
class Camera {
  constructor({canvas, pos, absSize}) {
    if(canvas === undefined)
      throw new Error('RequiredParam');
    this.canvas = canvas;
    this.pos = pos || new Vec();
    const defaultW = 2500;
    this.absSize = absSize || new Vec(defaultW, defaultW * canvas.height / canvas.width);
  }
  get xScale() {
    return this.canvas.width / this.absSize.x;
  }
  get yScale() {
    return this.canvas.height / this.absSize.y;
  }
  get absW() {
    return this.absSize.x;
  }
  get absH() {
    return this.absSize.y;
  }
  get realW() {
    return this.absSize.x * this.xScale;
  }
  get realH() {
    return this.absSize.y * this.yScale;
  }
  toRealX(absX) {
    return (absX - this.pos.x) * this.xScale;
  }
  toRealY(absY) {
    return (absY - this.pos.y) * this.yScale;
  }
  toAbsX(realX) {
    return (realX / this.xScale) + this.pos.x;
  }
  toAbsY(realY) {
    return (realY / this.yScale) + this.pos.y;
  }
  toRealW(absW) {
    return absW * this.xScale;
  }
  toRealH(absH) {
    return absH * this.yScale;
  }
  toAbsW(realW) {
    return realW / this.xScale;
  }
  toAbsH(realH) {
    return realH / this.yScale;
  }
}

export {Camera};
