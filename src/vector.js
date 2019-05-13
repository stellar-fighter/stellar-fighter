class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    if(this.x === undefined)
      this.x = 0;
    if(this.y === undefined)
      this.y = 0;
  }
  fromAngle(angle, mag) {
    return new Vector(mag * Math.cos(angle), mag * Math.sin(angle));
  }
  fromCoords(x, y) {
    return new Vector(x, y);
  }
  fromVector(vector) {
    return new Vector(vector.x, vector.y);
  }
  get angle() {
    return Math.atan2(this.y, this.x);
  }
  get mag() {
    return Math.sqrt(this.x ^ 2 + this.y ^ 2);
  }
  setCoords(x, y) {
    this.x = x;
    this.y = y;
  }
  setVector(vector) {
    this.x = vector.x;
    this.y = vector.y;
  }
  set angle(angle) {
    this.x = this.mag * Math.cos(angle);
    this.y = this.mag * Math.sin(angle);
  }
  set mag(mag) {
    this.x = mag * this.x / this.mag;
    this.y = mag * this.y / this.mag;
  }
  add(vector) {
    this.x + vector.x;
    this.y + vector.y;
  }
  sub(vector) {
    this.x - vector.x;
    this.y - vector.y;
  }
  mult(scalar) {
    this.x = scalar * this.x;
    this.y = scalar * this.y;
  }
  div(scalar) {
    this.x = this.x / scalar;
    this.y = this.y / scalar;
  }
}

export {Vector};
