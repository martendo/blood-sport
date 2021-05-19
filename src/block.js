class Block extends Sprite {
  constructor(game, map, x, y, tileId, flip) {
    super(game);
    
    this.SOLIDS_START = 24;
    
    this.map = map;
    
    this.tileId = tileId;
    this.isSolid = this.tileId >= this.SOLIDS_START;
    
    this.image = this.game.TILESET[this.tileId];
    this.flip = flip; // Unused
    
    this.x = x;
    this.y = y;
    this.rect = new Rect(
      this.x * this.game.TILE_SIZE,
      this.y * this.game.TILE_SIZE,
      this.game.TILE_SIZE,
      this.game.TILE_SIZE,
    );
  }
}
