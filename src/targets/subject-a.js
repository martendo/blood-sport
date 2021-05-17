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
    this.hitbox = new Rect(3, 16, 10, 16);
    this.animation.start();
    
    this.direction = Math.floor(Math.random() * 4);
    this.updateSpeed();
  }
  
  updateSpeed() {
    if (this.direction === this.game.DIR_UP) {
      this.vel.x = 0;
      this.vel.y = -this.SPEED;
    } else if (this.direction === this.game.DIR_DOWN) {
      this.vel.x = 0;
      this.vel.y = this.SPEED;
    } else if (this.direction === this.game.DIR_LEFT) {
      this.vel.x = -this.SPEED;
      this.vel.y = 0;
    } else if (this.direction === this.game.DIR_RIGHT) {
      this.vel.x = this.SPEED;
      this.vel.y = 0;
    }
  }
  
  turnAround() {
    this.direction ^= 1;
    this.updateSpeed();
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
