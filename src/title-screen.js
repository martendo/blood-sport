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
      "Play!",
      () => this.startGame(),
    );
  }
  
  show() {
    this.game.state = GameState.TITLE_SCREEN;
    this.button.enabled = true;
  }
  startGame() {
    this.game.state = GameState.IN_GAME;
    this.button.enabled = false;
    this.game.map.load(1);
  }
  
  update() {
    this.button.rect.x = (this.game.displayCanvas.width / 2) - (this.BUTTON_WIDTH / 2);
    this.button.rect.y = (this.game.displayCanvas.height / 2) - (this.BUTTON_HEIGHT / 2);
  }
  
  draw(ctx) {
    this.game.drawText({
      ctx: ctx,
      text: this.game.TITLE,
      x: this.game.displayCanvas.width / 2,
      y: this.game.displayCanvas.height / 3,
      font: "75px sans-serif",
      textAlign: "center",
      textBaseline: "middle",
    });
    
    this.game.drawText({
      ctx: ctx,
      text: "Copyright (C) 2021 Martin Baldwin",
      x: 0 + this.PADDING,
      y: this.game.displayCanvas.height - 25 - this.PADDING,
      font: "18px sans-serif",
      textAlign: "start",
      textBaseline: "bottom",
    });
    this.game.drawText({
      ctx: ctx,
      text: "Licensed under the GNU General Public License v3.0",
      x: 0 + this.PADDING,
      y: this.game.displayCanvas.height - this.PADDING,
    });
    
    this.game.drawText({
      ctx: ctx,
      text: "Last modified {{ DATE }}",
      x: this.game.displayCanvas.width - this.PADDING,
      y: this.game.displayCanvas.height - this.PADDING,
      textAlign: "end",
    });
    
    this.button.draw(ctx);
  }
}
