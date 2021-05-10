class Actor {
  constructor(game, pos = null) {
    this.game = game;
    
    this.pos = new Vector2(pos);
    this.direction = this.game.DIR_LEFT;
    
    this.game.actors.add(this);
  }
  
  update() {
    return;
  }
  
  draw() {
    return;
  }
}
