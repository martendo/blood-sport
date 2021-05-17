class Camera {
  constructor(game) {
    this.game = game;
    
    this.pos = new Vector2(0, 0);
  }
  
  update(followRect) {
    const mapWidthPx = this.game.map.width * this.game.TILE_SIZE;
    if (mapWidthPx <= this.game.canvas.width) {
      this.pos.x = -((this.game.canvas.width / 2) - (mapWidthPx / 2));
    } else {
      const x = followRect.centrex - (this.game.canvas.width / 2);
      if (x < 0) {
        this.pos.x = 0;
      } else if (x + this.game.canvas.width >= mapWidthPx) {
        this.pos.x = mapWidthPx - this.game.canvas.width;
      } else {
        this.pos.x = x;
      }
    }
    
    const mapHeightPx = this.game.map.height * this.game.TILE_SIZE;
    if (mapHeightPx <= this.game.canvas.height) {
      this.pos.y = -((this.game.canvas.height / 2) - (mapHeightPx / 2));
    } else {
      const y = followRect.centrey - (this.game.canvas.height / 2);
      if (y < 0) {
        this.pos.y = 0;
      } else if (y + this.game.canvas.height >= mapHeightPx) {
        this.pos.y = mapHeightPx - this.game.canvas.height;
      } else {
        this.pos.y = y;
      }
    }
  }
}
