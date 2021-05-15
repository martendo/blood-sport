class Subject extends Target {
  constructor(game, pos) {
    super(game);
    
    this.image = this.game.IMAGES["targets/subject"];
    this.setRect(new Rect(
      this.pos.x,
      this.pos.y,
      this.image.width,
      this.image.height,
    ));
    this.hitbox = new Rect(0, 0, 16, 32);
    
    this.pos = pos;
  }
}
