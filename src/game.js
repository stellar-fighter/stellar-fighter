class Game {
  constructor() {
    this.states = [];
    this.assets = {};
    this.assets.stellarFighter = new Image();
    this.assets.stellarFighter.src = './asset/fighter.png';
  }
  pushState(state) {
    this.states.push(state);
  }
  popState() {
    this.states.pop();
  }
  get state() {
    return this.states[this.states.length - 1];
  }
  set running(value) {
    this.states[this.states.length - 1].running = value;
  }
  get running() {
    return this.states[this.states.length - 1].running;
  }
  setTime(timeStamp) {
    this.states[this.states.length - 1].setTime(timeStamp);
  }
  update() {
    this.states[this.states.length - 1].update();
  }
  render() {
    this.states[this.states.length - 1].render();
  }
}

export {Game};
