class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    if(this.x === undefined)
      this.x = 0;
    if(this.y === undefined)
      this.y = 0;
  }
  fromAng(ang, mag) {
    return new Vec(mag * Math.cos(ang), mag * Math.sin(ang));
  }
  fromCo(x, y) {
    return new Vec(x, y);
  }
  fromVec(vec) {
    return new Vec(vec.x, vec.y);
  }
  get ang() {
    return Math.atan2(this.y, this.x);
  }
  get mag() {
    return Math.sqrt(this.x ^ 2 + this.y ^ 2);
  }
  setCo(x, y) {
    this.x = x;
    this.y = y;
  }
  set(x, y) {
    this.setCo(x, y);
  }
  setVec(vec) {
    this.x = vec.x;
    this.y = vec.y;
  }
  set ang(ang) {
    this.x = this.mag * Math.cos(ang);
    this.y = this.mag * Math.sin(ang);
  }
  set mag(mag) {
    this.x = mag * this.x / this.mag;
    this.y = mag * this.y / this.mag;
  }
  addCo(x, y) {
    if(x === undefined)
      throw new Error('RequiredParam');
    if(y === undefined)
      throw new Error('RequiredParam');
    this.x += x;
    this.y += y;
  }
  add(x, y) {
    this.addCo(x, y);
  }
  addVec(vec) {
    this.x + vec.x;
    this.y + vec.y;
  }
  sub(vec) {
    this.x - vec.x;
    this.y - vec.y;
  }
  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
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

export {Vec};
