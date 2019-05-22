class Game {
  constructor() {
    this.states = [];
    this.assets = {};
    this.assets.fighter001 = new Image();
    this.assets.fighter001.src = './asset/space-shooter-redux/PNG/playerShip1_blue.png';
    this.assets.alien001 = new Image();
    this.assets.alien001.src = './asset/space-shooter-redux/PNG/Enemies/enemyRed1.png';
    this.assets.alien002 = new Image();
    this.assets.alien002.src = './asset/space-shooter-redux/PNG/Enemies/enemyRed2.png';
    this.assets.bullet001 = new Image();
    this.assets.bullet001.src = './asset/space-shooter-redux/PNG/Lasers/laserBlue11.png';
    this.assets.item001 = new Image();
    this.assets.item001.src = './asset/space-shooter-redux/PNG/ufoBlue.png';
    this.assets.stars = new Image();
    this.assets.stars.src = './asset/nebula/nebula10.png';
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
