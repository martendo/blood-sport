class EndScreen {
  constructor(game) {
    this.game = game;
    
    this.DELAY = 2000;
  }
  
  show() {
    setTimeout(() => this.game.state = GameState.END_SCREEN, this.DELAY);
  }
  
  draw(ctx) {
    ctx.fillStyle = "#000000";
    this.game.drawText({
      ctx: ctx,
      text: `Gleaned: ${this.game.player.gleaned}`,
      x: ctx.canvas.width / 2,
      y: ctx.canvas.height / 3,
      font: "50px sans-serif",
      textAlign: "center",
      textBaseline: "middle",
    });
    this.game.drawText({
      ctx: ctx,
      text: `Escaped: ${this.game.escapedTargets}`,
      x: ctx.canvas.width / 2,
      y: ctx.canvas.height / 3 + 50,
    });
  }
}
