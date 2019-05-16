class Timer {
  constructor() {
    this.beginning = null;
    this.current = null;
    this.delta = null;
  }
  record(timeStamp) {
    if(this.beginning === null)
      this.beginning = timeStamp;
    if(this.current !== null)
      this.delta = timeStamp - this.current;
    this.current = timeStamp;
  }
}

export {Timer};
