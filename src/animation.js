class Animation {
  constructor(sprite, game, settings) {
    this.sprite = sprite;
    this.game = game;
    
    this.settings = settings;
    
    const spritesheet = this.sprite.SPRITESHEET;
    this.seq = [];
    for (const image of this.settings.images) {
      this.seq.push(spritesheet[image]);
    }
    this.duration = this.settings.duration;
    
    this.frame = 0;
    this.timeout = null;
    this.playing = false;
  }
  
  get currentImage() {
    return this.seq[this.frame];
  }
  
  next() {
    this.frame = (this.frame + 1) % this.seq.length;
    this.sprite.image = this.currentImage;
    this.nextTimeout();
  }
  nextTimeout() {
    this.timeout = setTimeout(() => this.next(), this.duration[this.frame]);
  }
  
  start() {
    if (this.timeout == null) {
      this.nextTimeout();
    }
    this.playing = true;
    this.sprite.image = this.currentImage;
  }
  stop() {
    if (this.timeout != null) {
      clearTimeout(this.timeout);
    }
    this.timeout = null;
    this.playing = false;
  }
}
