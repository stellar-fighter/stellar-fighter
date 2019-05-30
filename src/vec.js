class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    if(this.x === undefined)
      this.x = 0;
    if(this.y === undefined)
      this.y = 0;
  }
  static fromAng(ang, mag) {
    return new Vec(mag * Math.cos(ang), mag * Math.sin(ang));
  }
  static fromCo(x, y) {
    return new Vec(x, y);
  }
  static fromVec(vec) {
    return new Vec(vec.x, vec.y);
  }

  get ang() {
    return Math.atan2(this.y, this.x);
  }
  getAng() {
    return this.ang;
  }
  get mag() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  getMag() {
    return this.mag;
  }

  set ang(ang) {
    this.x = this.mag * Math.cos(ang);
    this.y = this.mag * Math.sin(ang);
  }
  setAng(ang) {
    this.ang = ang;
    return this;
  }
  set mag(mag) {
    const oldMag = this.mag;
    this.x = mag * this.x / oldMag;
    this.y = mag * this.y / oldMag;
  }
  setMag(mag) {
    this.mag = mag;
    return this;
  }

  setCo(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  set(x, y) {
    this.setCo(x, y);
    return this;
  }
  setVec(vec) {
    this.x = vec.x;
    this.y = vec.y;
    return this;
  }
  addCo(x, y) {
    if(x === undefined)
      throw new Error('RequiredParam');
    if(y === undefined)
      throw new Error('RequiredParam');
    this.x += x;
    this.y += y;
    return this;
  }
  add(x, y) {
    this.addCo(x, y);
    return this;
  }
  addVec(vec) {
    this.x + vec.x;
    this.y + vec.y;
    return this;
  }
  sub(vec) {
    this.x - vec.x;
    this.y - vec.y;
    return this;
  }
  mult(scalar) {
    this.x = scalar * this.x;
    this.y = scalar * this.y;
    return this;
  }
  div(scalar) {
    this.x = this.x / scalar;
    this.y = this.y / scalar;
    return this;
  }
  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  }
}

export {Vec};
