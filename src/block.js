class Block {
  constructor(game, map, x, y, tileId, flip) {
    this.SOLIDS_START = 1;
    
    this.game = game;
    this.map = map;
    
    this.tileId = tileId;
    this.isSolid = this.tileId >= this.SOLIDS_START;
    
    this.image = this.game.TILESET[this.tileId];
    this.flipImage(flip);
    
    this.x = x;
    this.y = y;
  }
  
  flipImage(flip) {
    this.flip = flip;
    // TODO: Actually flip the image
  }
  
  draw() {
    this.game.ctx.drawImage(this.image, this.x * this.game.TILE_SIZE, this.y * this.game.TILE_SIZE);
  }
}
