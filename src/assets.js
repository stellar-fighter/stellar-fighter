/**
 * A class that manages assets
 */
class AssetMan {
  /**
   * Create a new AssetMan object
   * @constructor
   */
  constructor() {
    this.images = {};
    this.audios = {};
  }
  /**
   * Add an new image
   * @param {string} name - The image file name
   * @param {string} src - The image file source
   */
  addImage(name, src) {
    const image = new Image();
    image.src = src;
    this.images[name] = image;
  }
  /**
   * Add an new canvas with an image, strat point and size
   * @param {string} name - The canvas name
   * @param {string} image - The image file name
   * @param {Object} spos - The start position vector object
   * @param {Object} ssize - The start size vector object
   * @param {Object} dsize - The destination size vector object
   */
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
  /**
   * Add an audio
   * @param {string} name - The audio file name
   * @param {string} src - The audio file source
   */
  addAudio(name, src) {
    this.audios[name] = new Audio(src);
  }
}

export {AssetMan};
