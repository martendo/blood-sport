class GameMap {
  constructor(game) {
    this.EMPTY_TILE = 0;
    this.TILE_FLIP_H = 0x80000000;
    this.TILE_FLIP_V = 0x40000000;
    this.TILE_FLIP_D = 0x20000000;
    
    this.game = game;
    
    this.tilesets = {};
    
    this.EMPTY_BLOCK = new Block(this.game, this, 0, 0, 0, {
        h: false,
        v: false,
        d: false,
    });
    
    this.backgroundColour = Colour.PLACEHOLDER;
    
    this.blocks = new Set();
    this.blockMap = {};
  }
  
  getTilemap() {
    for (const layer of this.data["layers"]) {
      if (layer["type"] === "tilelayer") {
        return layer["data"];
      }
    }
    throw `No tile layer found in maps/${map}.json"`;
  }
  
  load(map) {
    fetch(`maps/${map}.json`)
      .then((response) => response.json())
      .then((data) => this.setup(data));
  }
  setup(data) {
    this.data = data;
    
    this.backgroundColour = this.data["backgroundcolor"];
    
    // Tilemap
    this.tilemap = this.getTilemap();
    this.width = this.data["width"];
    this.height = this.data["height"];
    
    this.reset();
  }
  
  createBlocks() {
    this.blocks.clear();
    this.blockMap = {};
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const pos = y * this.width + x;
        
        const [tileId, tileset, flip] = this._resolveGid(this.tilemap[pos]);
        if (tileId === this.EMPTY_TILE) {
          continue;
        }
        
        const block = new Block(this.game, this, x, y, tileId - tileset["firstgid"], flip);
        this.blocks.add(block);
        this.blockMap[pos] = block;
      }
    }
  }
  
  _resolveGid(gid) {
    const flip = {
      h: Boolean(gid & this.TILE_FLIP_H),
      v: Boolean(gid & this.TILE_FLIP_V),
      d: Boolean(gid & this.TILE_FLIP_D),
    };
    // Clear flipping flags
    gid &= ~(this.TILE_FLIP_H | this.TILE_FLIP_V | this.TILE_FLIP_D);
    
    for (let i = this.data["tilesets"].length - 1; i >= 0; i--) {
      const tileset = this.data["tilesets"][i];
      if (tileset["firstgid"] <= gid) {
        return [gid, tileset, flip];
      }
    }
    return [this.EMPTY_TILE, null, flip];
  }
  
  getBlock(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return this.EMPTY_BLOCK;
    }
    const pos = y * this.width + x;
    if (!this.blockMap.hasOwnProperty(pos)) {
      return this.EMPTY_BLOCK;
    }
    return this.blockMap[pos];
  }
  
  draw() {
    this.game.ctx.fillStyle = this.backgroundColour;
    this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    for (const block of this.blocks) {
      block.draw();
    }
  }
  
  reset() {
    this.createBlocks();
  }
}
