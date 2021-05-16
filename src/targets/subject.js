class Subject extends Target {
  constructor(game, pos) {
    super(game);
    
    this.SPEED = 0.25;
    
    this.pos = pos;
    this.image = this.game.SPRITESHEETS["targets/subject"][0];
    this.setRect(new Rect(
      0,
      0,
      this.image.width,
      this.image.height,
    ));
    this.hitbox = new Rect(0, 0, 16, 32);
    
    this.vel.x = this.SPEED * this.direction;
  }
  
  turnAround() {
    this.direction = -this.direction;
    this.vel.x = this.SPEED * this.direction;
  }
  
  update() {
    super.update();
    
    if (this.blockcollided.x) {
      this.turnAround();
    }
  }
  hitTarget() {
    this.turnAround();
  }
}
