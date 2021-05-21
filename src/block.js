class Block extends Sprite {
  constructor(game, map, x, y, tileId, flip) {
    super(game);
    
    this.SOLIDS_STARTS = {
      1: 24,
    };
    
    this.map = map;
    
    this.tileId = tileId;
    this.isSolid = this.tileId >= this.SOLIDS_STARTS[this.map.current];
    
    this.image = this.game.TILESETS[this.map.current][this.tileId];
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
