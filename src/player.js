class Player extends Actor {
  constructor(game) {
    super(game, new Rect(0, 0, 16, 32));
    this.width = 16;
    this.height = 32;
    
    // Player constants
    
    this.ACCEL = 0.25;
    this.FRICTION = 0.125;
    this.MAX_VELX = 2;
    
    // Player setup
    
    this.image = this.game.IMAGES["goddard"];
    
    this.reset();
  }
  
  update() {
    if (this.game.inputHandler.keys.has("ArrowRight")) {
      this.vel.x += this.ACCEL;
    }
    if (this.game.inputHandler.keys.has("ArrowLeft")) {
      this.vel.x -= this.ACCEL;
    }
    
    if (this.vel.x > 0) {
      this.vel.x -= this.FRICTION;
      // Friction should not make you start moving the other way
      if (this.vel.x < 0) {
        this.vel.x = 0;
      }
    } else if (this.vel.x < 0) {
      this.vel.x += this.FRICTION;
      if (this.vel.x > 0) {
        this.vel.x = 0;
      }
    }
    
    if (this.vel.x > this.MAX_VELX) {
      this.vel.x = this.MAX_VELX;
    } else if (this.vel.x < -this.MAX_VELX) {
      this.vel.x = -this.MAX_VELX;
    }
    
    super.update();
  }
  
  reset(pos = new Vector2(), direction = null) {
    this.pos = new Vector2(pos);
    if (direction != null) {
      this.direction = direction;
    }
  }
}
