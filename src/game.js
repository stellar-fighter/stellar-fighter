import {AssetMan} from './assets';
class Game {
  constructor() {
    this.states = [];
    this.assetMan = new AssetMan();
    this.assetMan.addImage('fighter001', './asset/space-shooter-redux/PNG/playerShip1_blue.png');
    this.assetMan.addImage('alien001', './asset/space-shooter-redux/PNG/Enemies/enemyRed1.png');
    this.assetMan.addImage('alien002', './asset/space-shooter-redux/PNG/Enemies/enemyRed2.png');
    this.assetMan.addImage('bullet001', './asset/space-shooter-redux/PNG/Lasers/laserBlue11.png');
    this.assetMan.addImage('item001', './asset/space-shooter-redux/PNG/ufoBlue.png');
    this.assetMan.addImage('bg010', './asset/nebula/nebula10.png');
    this.assetMan.addAudio('shoot001', './asset/space-shooter-redux/Bonus/sfx_laser1.ogg');
    this.assetMan.addAudio('shoot002', './asset/space-shooter-redux/Bonus/sfx_laser2.ogg');
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
