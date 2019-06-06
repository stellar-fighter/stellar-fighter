/**
 * A class that handles vector operations
 */
class Vec {
  /**
   * Create a new Vec with coordinates x,y
   * Defines as 0 if x or y are not defined
   * @param {number} x - The x value
   * @param {number} y - The y value
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
   * Returns a new Vec obtained by angle and magnitude
   * @param {number} ang - The angle value 
   * @param {number} mag - The magnitude value
   * @return {Object} a new Vec object
   */
  static fromAng(ang, mag) {
    return new Vec(mag * Math.cos(ang), mag * Math.sin(ang));
  }
  /**
   * Returns a new Vec obtained by coordinate x and y
   * @param {number} x - The x value
   * @param {number} y - The y value
   * @return {Object} a new Vec object
   */
  static fromCo(x, y) {
    return new Vec(x, y);
  }
  /**
   * Returns a new Vec with the x-coordinate y-coordinate of the vectors entered into the input.
   * @param {Obect} vec - The vector object
   * @return {Object} a new Vec object
   */
  static fromVec(vec) {
    return new Vec(vec.x, vec.y);
  }
  /**
   * Returns angle obtained from the x-coordinate y-coordinate of the vector
   * @return {number} angle of the vector
   */
  get ang() {
    return Math.atan2(this.y, this.x);
  }
  /**
   * Returns angle of the vector
   * @return {number} angle of the vector
   */
  getAng() {
    return this.ang;
  }
  /**
   *  Returns magnitude obtained from x-coordinate y-coordinate of the vector
   *  @return {number} magnitude of the vector
   */
  get mag() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  /**
   * Returns magnitude of the vector
   * @return {number} magnitude of the vector
   */
  getMag() {
    return this.mag;
  }
  /**
   * Sets the angle by the angle of the vector entered into the input and the magnitude of the vector
   * @param {number} ang - The angle value 
   */
  set ang(ang) {
    this.x = this.mag * Math.cos(ang);
    this.y = this.mag * Math.sin(ang);
  }
  /**
   * Sets the angle of the vector with the angle entered by the input
   * @param {number} ang - The angle value 
   * @return {Object} the changed Vec object
   */
  setAng(ang) {
    this.ang = ang;
    return this;
  }
  /**
   * Sets the vector magnitude to the magnitude entered by the input.
   * @param {number} mag - The magnitude value
   */
  set mag(mag) {
    const oldMag = this.mag || 1;
    this.x = mag * this.x / oldMag;
    this.y = mag * this.y / oldMag;
  }
  /**
   * Sets the magnitude of the vector with the manitude entered by the input
   * @param {number} mag - The magnitude value
   * @return {Object} the changed Vec object
   */
  setMag(mag) {
    this.mag = mag;
    return this;
  }
  /**
   * Sets coordinate of the vector with x and y coordinates entered by input
   * @param {number} x - The x value
   * @param {number} y - The y value
   * @return {Object} the changed Vec object
   */
  setCo(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  /**
   * Sets x and y coordinates of the vector using setCo functions with x- and y-coordinates entered by input
   * @param {number} x - The x value
   * @param {number} y - The y value
   * @return {Object} the changed Vec object
   */
  set(x, y) {
    this.setCo(x, y);
    return this;
  }
  /**
   * Sets coordinate of the vector with x and y coordinates of the vector entered by input
   * @param {Obect} vec - The vector object
   * @return {Object} the changed Vec object
   */
  setVec(vec) {
    this.x = vec.x;
    this.y = vec.y;
    return this;
  }
  /**
   * Returns the vector by adding the x-coordinate y-coordinate of the input vector and the vector respectively
   * Defines as error if x or y are not defined
   * @param {number} x - The x value
   * @param {number} y - The y value
   * @return {Object} the changed Vec object
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
   * @param {number} x - The x value
   * @param {number} y - The y value
   * @return {Object} the changed Vec object
   */
  add(x, y) {
    this.addCo(x, y);
    return this;
  }
  /**
   * Returns the vector by adding the x-coordinate y-coordinate of the input vector and the vector respectively
   * @param {Object} vec - The vector object
   * @return {Object} the changed Vec object
   */
  addVec(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }
 /**
   * Returns the vector by subtracting the x-coordinate y-coordinate of the input vector and the vector respectively
   * Defines as error if x or y are not defined
   * @param {number} x - The x value
   * @param {number} y - The y value
   * @return {Object} the changed Vec object
   */
  subCo(x, y) {
    if(x === undefined)
      throw new Error('RequiredParam');
    if(y === undefined)
      throw new Error('RequiredParam');
    this.x -= x;
    this.y -= y;
    return this;
  }
  /**
   *  Sets x and y coordinates of the vector using subCo functions with x- and y-coordinates entered by input
   * @param {number} x - The x value
   * @param {number} y - The y value
   * @return {Object} the changed Vec object
   */
  sub(x, y) {
    this.subCo(x, y);
    return this;
  }
    /**
   * Returns the vector by subtracting the x-coordinate y-coordinate of the input vector and the vector respectively
   * @param {Obect} vec - The vector object
   * @return {Object} the changed Vec object
   */
  subVec(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }
    /**
   * Returns the vector by multiplying the x-coordinate y-coordinate of the vector by the scalar
   * @param {number} scalar - The scalar value
   * @return {Object} the changed Vec object
   */
  mult(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }
    /**
   * Returns the vector by dividing the x-coordinate y-coordinate of the vector by the scalar
   * @param {number} scalar - The scalar value
   * @return {Object} the changed Vec object
   */
  div(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }
    /**
   * Returns a value by internal operation of the input vector and the vector
   * @param {Obect} vec - The vector object
   * @return {number} value from internal opration two vectors
   */   
  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  }
}

export {Vec};
