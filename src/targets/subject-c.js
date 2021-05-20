class SubjectC extends Target {
  constructor(game, pos) {
    super(game);
    
    this.SPRITESHEET = this.game.SPRITESHEETS["targets/subject-c"];
    
    this.pos = pos;
    this.animation = new Animation(this, this.game, {
      images: [0, 1, 0, 1],
      duration: [1500, 100, 100, 100],
    });
    this.image = this.animation.currentImage;
    this.setRect(new Rect(
      0,
      0,
      this.image.width,
      this.image.height,
    ));
    this.hitbox = new Rect(3, 16, 10, 16);
    this.animation.start();
  }
}
