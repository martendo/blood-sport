class Player extends Actor {
  constructor(game) {
    super(game);
    this.image = this.game.IMAGES["goddard"];
    
    this.reset();
  }
  
  update() {
    super.update();
  }
  
  reset(pos = new Vector2(), direction = null) {
    this.pos = new Vector2(pos);
    if (direction != null) {
      this.direction = direction;
    }
  }
}
