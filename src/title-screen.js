class TitleScreen {
  constructor(game) {
    this.game = game;
    
    this.PADDING = 15;
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
      "Play",
      () => this.startGame(),
    );
  }
  
  show() {
    this.game.state = GameState.TITLE_SCREEN;
    this.button.enabled = true;
  }
  startGame() {
    this.button.enabled = false;
    this.game.map.load(1);
  }
  
  draw(ctx) {
    ctx.fillStyle = "#000000";
    this.game.drawText({
      ctx: ctx,
      text: this.game.TITLE,
      x: ctx.canvas.width / 2,
      y: ctx.canvas.height / 3,
      font: "75px sans-serif",
      textAlign: "center",
      textBaseline: "middle",
    });
    this.game.drawText({
      ctx: ctx,
      text: "\"They gleaned for sport—for the joy of it—…because they can\" (Shusterman 263)",
      x: ctx.canvas.width / 2,
      y: ctx.canvas.height / 3 + 75,
      font: "18px sans-serif",
    });
    
    this.game.drawText({
      ctx: ctx,
      text: "Copyright (C) 2021 Martin Baldwin",
      x: 0 + this.PADDING,
      y: ctx.canvas.height - 25 - this.PADDING,
      textAlign: "start",
      textBaseline: "bottom",
    });
    this.game.drawText({
      ctx: ctx,
      text: "Licensed under the GNU General Public License v3.0",
      x: 0 + this.PADDING,
      y: ctx.canvas.height - this.PADDING,
    });
    
    this.game.drawText({
      ctx: ctx,
      text: "Last modified {{ DATE }}",
      x: ctx.canvas.width - this.PADDING,
      y: ctx.canvas.height - 25 - this.PADDING,
      textAlign: "end",
    });
    this.game.drawText({
      ctx: ctx,
      text: "https://github.com/martendo/blood-sport",
      x: ctx.canvas.width - this.PADDING,
      y: ctx.canvas.height - this.PADDING,
    });
    
    this.button.rect.x = (ctx.canvas.width / 2) - (this.BUTTON_WIDTH / 2);
    this.button.rect.y = (ctx.canvas.height / 2) - (this.BUTTON_HEIGHT / 2);
    this.button.draw(ctx);
  }
}
