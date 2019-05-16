import {Vec} from './vec';
class Camera {
  constructor({canvas, pos, sFactor}) {
    this.canvas = canvas;
    this.pos = pos || new Vec();
    this.sFactor = sFactor || 3000;
  }
  get scale() {
    return this.canvas.width / 3000;
  }
}

export {Camera};
