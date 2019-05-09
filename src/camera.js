class Camera {
  constructor({canvas, x, y, sFactor}) {
    this.canvas = canvas;
    this.x = x || 0;
    this.y = y || 0;
    this.sFactor = sFactor || 3000;
  }
  get scale() {
    return this.canvas.width / 3000;
  }
}

export {Camera};
