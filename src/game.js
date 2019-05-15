class Game {
  constructor() {
    this.states = []; //
    this.assets = {};
    this.assets.stellarFighter = new Image();
    this.assets.stellarFighter.src = './asset/fighter.png';
    //추가
    this.assets.alien001 = new Image();
    this.assets.alien001.src = './asset/alien001.jpg';
    ////////////////////
    this.assets.boss = new Image();
    this.assets.boss.src = './asset/boss.png';
    ////////////////////

    this.assets.potion = new Image();
    this.assets.potion.src = './asset/potion.jpg';

    ////////
    this.assets.fire = new Image();
    this.assets.fire.src = './asset/fire.png';
  }
  pushState(state) {// psug state 했던거 playState 들어옴
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
  update() { //
    if(this.states.length > 0)
      this.states[this.states.length - 1].update(); //push_state
  }
  render() {
    if(this.states.length > 0)
      this.states[this.states.length - 1].render();
  }
}

export {Game};
