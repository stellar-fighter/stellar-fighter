/**
 * A class that handles vector operations
 */
class Vec {
  /**
   * Returns a vetor with coordinates x,y
   * Defines as 0 if x or y are not defined
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    if(this.x === undefined)
      this.x = 0;
    if(this.y === undefined)
      this.y = 0;
  }
  /**
   * Returns a vector obtained by angle and magnitude
   * @param {number} ang 
   * @param {number} mag 
   */
  static fromAng(ang, mag) {
    return new Vec(mag * Math.cos(ang), mag * Math.sin(ang));
  }
  /**
   * Returns a vector obtained by coordinate x and y
   * @param {number} x 
   * @param {number} y 
   */
  static fromCo(x, y) {
    return new Vec(x, y);
  }
  /**
   * Returns a vector with the x-coordinate y-coordinate of the vectors entered into the input.
   * @param {Vec} vec 
   */
  static fromVec(vec) {
    return new Vec(vec.x, vec.y);
  }
  /**
   * Returns angle obtained from the x-coordinate y-coordinate of the vector
   */
  get ang() {
    return Math.atan2(this.y, this.x);
  }
  /**
   * Returns angle of the vector
   */
  getAng() {
    return this.ang;
  }
  /**
   *  Returns magnitude obtained from x-coordinate y-coordinate of the vector
   */
  get mag() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  /**
   * Returns magnitude of the vector
   */
  getMag() {
    return this.mag;
  }
  /**
   * Sets the x-coordinate y-coordinate by the angle of the vector entered into the input and the magnitude of the vector
   * @param {number} ang
   */
  set ang(ang) {
    this.x = this.mag * Math.cos(ang);
    this.y = this.mag * Math.sin(ang);
  }
  /**
   * Sets the angle of the vector with the angle entered by the input
   * @param {number} ang
   */
  setAng(ang) {
    this.ang = ang;
    return this;
  }
  /**
   * Sets the vector magnitude to the magnitude entered by the input.
   * @param {number} mag
   */
  set mag(mag) {
    const oldMag = this.mag;
    this.x = mag * this.x / oldMag;
    this.y = mag * this.y / oldMag;
  }
  /**
   * Sets the magnitude of the vector with the manitude entered by the input
   * @param {number} mag
   */
  setMag(mag) {
    this.mag = mag;
    return this;
  }
  /**
   * Sets coordinate of the vector with x and y coordinates entered by input
   * @param {number} x 
   * @param {number} y 
   */
  setCo(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  /**
   * Sets x and y coordinates of the vector using setCo functions with x- and y-coordinates entered by input
   * @param {number} x 
   * @param {number} y 
   */
  set(x, y) {
    this.setCo(x, y);
    return this;
  }
  /**
   * Sets coordinate of the vector with x and y coordinates of the vector entered by input
   * @param {Vec} vec 
   */
  setVec(vec) {
    this.x = vec.x;
    this.y = vec.y;
    return this;
  }
  /**
   * Returns the vector by adding the x-coordinate y-coordinate of the input vector and the vector respectively
   * Defines as error if x or y are not defined
   * @param {number} x 
   * @param {number} y 
   */
  addCo(x, y) {
    if(x === undefined)
      throw new Error('RequiredParam');
    if(y === undefined)
      throw new Error('RequiredParam');
    this.x += x;
    this.y += y;
    return this;
  }
  /**
   *  Sets x and y coordinates of the vector using addCo functions with x- and y-coordinates entered by input
   * @param {number} x 
   * @param {number} y 
   */
  add(x, y) {
    this.addCo(x, y);
    return this;
  }
  /**
   * Returns the vector by adding the x-coordinate y-coordinate of the input vector and the vector respectively
   * @param {Vec} vec 
   */
  addVec(vec) {
    this.x + vec.x;
    this.y + vec.y;
    return this;
  }
  /**
   * Returns the vector by subtracting the x-coordinate y-coordinate of the input vector and the vector respectively
   * @param {Vec} vec 
   */
  sub(vec) {
    this.x - vec.x;
    this.y - vec.y;
    return this;
  }
  /**
   * Returns the vector by multiplying the x-coordinate y-coordinate of the vector by the scalar
   * @param {number} scalar 
   */
  mult(scalar) {
    this.x = scalar * this.x;
    this.y = scalar * this.y;
    return this;
  }
  /**
   * Returns the vector by dividing the x-coordinate y-coordinate of the vector by the scalar
   * @param {number} scalar 
   */
  div(scalar) {
    this.x = this.x / scalar;
    this.y = this.y / scalar;
    return this;
  }
  /**
   * Returns the vector by internal operation of the input vector and the vector
   * @param {Vec} vec 
   */   
  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  }
}

export {Vec};
