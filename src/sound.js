class Sound {
  constructor({source, volume, loop}) {
    this.source = source;
    this.volume = volume;
    this.loop = loop;
    var son;
    this.son = son;
    this.finish = false;
  }
  stop() {
    document.body.removeChild(this.son);
  }
  start() {
    if (this.finish) return false;
    this.son = document.createElement("embed");
    this.son.setAttribute("src", this.source);
    this.son.setAttribute("hidden", "true");
    this.son.setAttribute("volume", this.volume);
    this.son.setAttribute("autostart", "true");
    this.son.setAttribute("loop", this.loop);
    document.body.appendChild(this.son);
  }
  remove() {
    document.body.removeChild(this.son);
    this.finish = true;
  }
  init(volume, loop) {
    this.finish = false;
    this.volume = volume;
    this.loop = loop;
  }
}

export {Sound};
