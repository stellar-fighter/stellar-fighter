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
  switchState(state) {
    this.states[this.states.length - 1].destroy();
    this.states[this.states.length - 1] = state;
  }
  get state() {
    return this.states[this.states.length - 1];
  }
  setTime(timeStamp) {
    if(this.states.length > 0)
      this.states[this.states.length - 1].setTime(timeStamp);
  }
  update() {
    for(let index = this.states.length - 1; index >= 0; --index)
      this.states[index].update();
  }
  render() {
    for(let index = 0; index < this.states.length; ++index)
      this.states[index].render();
  }
}

export {Game};
