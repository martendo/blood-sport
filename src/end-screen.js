class EndScreen {
  constructor(game) {
    this.game = game;
    
    this.DELAY = 2000;
    
    this.BUTTON_WIDTH = 300;
    this.BUTTON_HEIGHT = 75;
    
    this.button = new Button(
      this.game,
      {
        x: 0,
        y: 0,
        width: this.BUTTON_WIDTH,
        height: this.BUTTON_HEIGHT,
      },
      "Continue",
      () => this.continueGame(),
    );
  }
  
  show() {
    setTimeout(() => this.game.state = GameState.END_SCREEN, this.DELAY);
    
    if (this.game.map.current < this.game.LEVEL_COUNT) {
      if (Math.abs((this.game.player.gleaned / this.game.map.quota) - 1) > 0.2) {
        // +/- 20% from quota -> no good!
        this.willContinue = false;
        this.button.enabled = true;
      } else {
        this.willContinue = true;
      }
      this.finished = false;
    } else {
      this.willContinue = false;
      this.finished = true;
    }
  }
  continueGame() {
    this.button.enabled = false;
    this.game.map.load(this.game.map.current + 1);
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
      y: ctx.canvas.height / 3 + 60,
    });
    
    this.game.drawText({
      ctx: ctx,
      text: `Quota: ${this.game.map.quota}`,
      x: ctx.canvas.width / 2,
      y: ctx.canvas.height / 3 + 150,
    });
    
    if (this.finished) {
      this.game.drawText({
        ctx: ctx,
        text: "All mass gleanings have been completed.",
        x: ctx.canvas.width / 2,
        y: ctx.canvas.height / 3 * 2,
      });
    } else {
      if (this.willContinue) {
        this.button.rect.x = (ctx.canvas.width / 2) - (this.BUTTON_WIDTH / 2);
        this.button.rect.y = (ctx.canvas.height / 3 * 2) - (this.BUTTON_HEIGHT / 2);
        this.button.draw(ctx);
      } else {
        this.game.drawText({
          ctx: ctx,
          text: "You're too far off the quota! That is unacceptable!",
          x: ctx.canvas.width / 2,
          y: ctx.canvas.height / 3 * 2,
          font: "50px sans-serif",
          textAlign: "center",
          textBaseline: "middle",
        });
      }
    }
  }
}
