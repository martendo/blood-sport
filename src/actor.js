class Actor {
  constructor(game, pos = null) {
    this.game = game;
    
    this.pos = new Vector2(pos);
    this.vel = new Vector2();
    this.direction = this.game.DIR_LEFT;
    
    this.game.actors.add(this);
  }
  
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
  
  draw() {
    this.game.ctx.drawImage(this.image, this.pos.x, this.pos.y);
  }
}
