/**
 * A class that records time
 */
class Timer {
  /**
   * Returns an empty timer
   */
  constructor() {
    this.beginning = null;
    this.current = null;
    this.delta = null;
  }
  /**
   * Records current time related data
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
