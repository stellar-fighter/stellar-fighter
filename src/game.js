class Game {
  constructor() {
    this.states = [];
    this.assets = {};
    this.assets.stellarFighter = new Image();
    this.assets.stellarFighter.src = './asset/fighter.png';
    this.assets.fire = new Image();
    this.assets.fire.src = './asset/fire.png';
  }
  pushState(state) {
    this.states.push(state);
  }
  popState() {
    this.states[this.states.length - 1].destroy();
    this.states.pop();
  }
  get state() {
    return this.states[this.states.length - 1];
  }
  setTime(timeStamp) {
    if(this.states.length > 0)
      this.states[this.states.length - 1].setTime(timeStamp);
  }
  update() {
    if(this.states.length > 0)
      this.states[this.states.length - 1].update();
  }
  render() {
    if(this.states.length > 0)
      this.states[this.states.length - 1].render();
  }
}

export {Game};
