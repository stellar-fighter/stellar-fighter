import {AssetMan} from './assets';
import {Vec} from './vec';
class Game {
  constructor() {
    this.states = [];
    this.assetMan = new AssetMan();
    this.assetMan.addAudio('shoot001', './asset/space-shooter-redux/Bonus/sfx_laser1.ogg');
    this.assetMan.addAudio('shoot002', './asset/space-shooter-redux/Bonus/sfx_laser2.ogg');
    this.assetMan.addImage('bg010', './asset/nebula/nebula10.png');
    this.assetMan.addImage('sheet001', './asset/space-shooter-redux/Spritesheet/sheet.png');
    const sheet001 = this.assetMan.images.sheet001;
    sheet001.onload = () => {
      this.assetMan.addCanvas(
        'fighter001',
        sheet001,
        new Vec(211, 941),
        new Vec(99, 75),
      );
      this.assetMan.addCanvas(
        'alien001',
        sheet001,
        new Vec(425, 384),
        new Vec(93, 84),
      );
      this.assetMan.addCanvas(
        'alien002',
        sheet001,
        new Vec(120, 520),
        new Vec(104, 84),
      );
      this.assetMan.addCanvas(
        'bullet001',
        sheet001,
        new Vec(698, 795),
        new Vec(38, 37),
      );
      this.assetMan.addCanvas(
        'item001',
        sheet001,
        new Vec(444, 91),
        new Vec(91, 91),
      );
    };
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
  flushStates() {
    while(this.states.length - 1 >= 0) {
      this.states[this.states.length - 1].destroy();
      this.states.pop();
    }
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
