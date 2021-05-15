class Subject extends Target {
  constructor(game, pos) {
    super(game);
    
    this.pos = pos;
    this.image = this.game.SPRITESHEETS["targets/subject"][0];
    this.setRect(new Rect(
      0,
      0,
      this.image.width,
      this.image.height,
    ));
    this.hitbox = new Rect(0, 0, 16, 32);
  }
}
