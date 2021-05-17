class SubjectA extends Target {
  constructor(game, pos) {
    super(game);
    
    this.SPRITESHEET = this.game.SPRITESHEETS["targets/subject-a"];
    this.SPEED = 0.25;
    
    this.pos = pos;
    this.animation = new Animation(this, this.game, {
      images: [0, 1],
      duration: [250, 250],
    });
    this.image = this.animation.currentImage;
    this.setRect(new Rect(
      0,
      0,
      this.image.width,
      this.image.height,
    ));
    this.hitbox = new Rect(3, 1, 10, 31);
    this.animation.start();
    
    this.vel.x = this.SPEED * this.direction;
  }
  
  turnAround() {
    this.direction = -this.direction;
    this.vel.x = this.SPEED * this.direction;
  }
  
  update() {
    super.update();
    
    if (this.blockcollided.x || this.blockcollided.y) {
      this.turnAround();
    }
  }
  hitTarget() {
    this.turnAround();
  }
}
