class AssetMan {
  constructor() {
    this.images = {};
    this.audios = {};
  }
  addImage(name, src) {
    const image = new Image();
    image.src = src;
    this.images[name] = image;
  }
  addCanvas(name, image, spos, ssize, dsize) {
    const canvas = document.createElement('canvas');
    if(dsize)
      [canvas.width, canvas.height] = [dsize.x, dsize.y];
    else
      [canvas.width, canvas.height] = [ssize.x, ssize.y];
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, spos.x, spos.y, ssize.x, ssize.y, 0, 0, canvas.width, canvas.height);
    this.images[name] = canvas;
  }
  addAudio(name, src) {
    this.audios[name] = new Audio(src);
  }
}

export {AssetMan};
