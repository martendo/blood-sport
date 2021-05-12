class Button {
  constructor(game, rect, text, func) {
    this.game = game;
    
    this.enabled = false;
    
    this.rect = rect;
    this.text = text;
    this.func = func;
    
    this.game.buttons.add(this);
  }
  
  isHovered() {
    const pointerPos = this.game.inputHandler.pointer.pos;
    return (pointerPos.x >= this.rect.x && pointerPos.x < this.rect.x + this.rect.width
      && pointerPos.y >= this.rect.y && pointerPos.y < this.rect.y + this.rect.height);
  }
  
  click() {
    this.func();
  }
  
  draw(ctx) {
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = this.isHovered() ? 0.25 : 0.125;
    ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    ctx.globalAlpha = 1;
    this.game.drawText({
      ctx: ctx,
      text: this.text,
      x: this.rect.x + (this.rect.width / 2),
      y: this.rect.y + (this.rect.height / 2),
      font: "50px sans-serif",
      textAlign: "center",
      textBaseline: "middle",
    });
  }
}
