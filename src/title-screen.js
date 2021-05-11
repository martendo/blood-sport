class TitleScreen {
  constructor(game) {
    this.game = game;
    
    this.PADDING = 15;
    
    this.button = {
      width: 500,
      height: 100,
    };
  }
  
  draw() {
    this.game.drawText({
      text: this.game.TITLE,
      x: this.game.displayCanvas.width / 2,
      y: this.game.displayCanvas.height / 3,
      font: "75px sans-serif",
      textAlign: "center",
      textBaseline: "middle",
    });
    
    this.game.drawText({
      text: "Copyright (C) 2021 Martin Baldwin",
      x: 0 + this.PADDING,
      y: this.game.displayCanvas.height - 25 - this.PADDING,
      font: "18px sans-serif",
      textAlign: "start",
      textBaseline: "bottom",
    });
    this.game.drawText({
      text: "Licensed under the GNU General Public License v3.0",
      x: 0 + this.PADDING,
      y: this.game.displayCanvas.height - this.PADDING,
    });
    
    this.game.drawText({
      text: "Last modified {{ DATE }}",
      x: this.game.displayCanvas.width - this.PADDING,
      y: this.game.displayCanvas.height - this.PADDING,
      textAlign: "end",
    });
  }
}
