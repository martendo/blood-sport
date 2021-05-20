class SubjectB extends Target {
  constructor(game, pos) {
    super(game);
    
    this.SPRITESHEET = this.game.SPRITESHEETS["targets/subject-b"];
    
    this.pos = pos;
    this.animation = new Animation(this, this.game, {
      images: [0, 1],
      duration: [500, 500],
    });
    this.image = this.animation.currentImage;
    this.setRect(new Rect(
      0,
      0,
      this.image.width,
      this.image.height,
    ));
    this.hitbox = new Rect(2, 6, 11, 10);
    this.animation.start();
  }
}
