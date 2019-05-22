/**
 * Class that records time
 */

class Timer {
  /**
   * Returns a empty timer
   */
  constructor() {
    this.beginning = null;
    this.current = null;
    this.delta = null;
  }
  /**
   * @param {number} timeStamp - Current timestamp
   */
  record(timeStamp) {
    if(this.beginning === null)
      this.beginning = timeStamp;
    if(this.current !== null)
      this.delta = timeStamp - this.current;
    this.current = timeStamp;
  }
}

export {Timer};
