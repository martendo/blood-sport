class Subject extends Target {
  constructor(game, pos) {
    super(game, new Rect(0, 0, 16, 32), pos);
    
    this.image = this.game.IMAGES["targets/subject"];
    this.setRect(new Rect(
      this.pos.x,
      this.pos.y,
      this.image.width,
      this.image.height,
    ));
  }
}
