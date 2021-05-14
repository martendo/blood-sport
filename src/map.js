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
    this.targets = new Set();
    this.blockMap = {};
    
    this.isReady = false;
  }
  
  getLayer(type) {
    for (const layer of this.data["layers"]) {
      if (layer["type"] === type) {
        return layer;
      }
    }
    throw `No layer of type "${type}" found in GameMap.data`;
  }
  
  load(map) {
    this.isReady = false;
    fetch(`maps/${map}.json`)
      .then((response) => response.json())
      .then((data) => this.setup(data));
  }
  setup(data) {
    this.data = data;
    
    this.backgroundColour = this.data["backgroundcolor"];
    
    // Tilemap
    this.tilemap = this.getLayer("tilelayer")["data"];
    this.width = this.data["width"];
    this.height = this.data["height"];
    
    // Target Data
    this.objects = this.getLayer("objectgroup")["objects"];
    this.targetData = [];
    for (const object of this.objects) {
      if (object.hasOwnProperty("gid")) {
        this.targetData.push(object);
      }
    }
    
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
  
  async createTargets() {
    for (const target of this.targets) {
      this.game.actors.delete(target);
    }
    this.targets.clear();
    for (const target of this.targetData) {
      const [tileId, tileset, flip] = this._resolveGid(target["gid"]);
      const tile = await this.getTile(
        tileId - tileset["firstgid"],
        `maps/${tileset["source"]}`,
      )
      this.targets.add(new TARGET_TYPES[tile["type"]](
        this.game,
        new Vector2(target["x"], target["y"]),
      ));
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
  
  async getTileset(tileset) {
    if (this.tilesets.hasOwnProperty(tileset)) {
      return this.tilesets[tileset];
    }
    const response = await fetch(tileset);
    const data = await response.json();
    this.tilesets[tileset] = data;
    return data;
  }
  
  async getTile(tileId, tileset) {
    const data = await this.getTileset(tileset);
    for (const tile of data["tiles"]) {
      if (tile["id"] == tileId) {
        return tile;
      }
    }
    return null;
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
  
  update() {
    for (const target of this.targets) {
      target.update();
    }
  }
  
  draw(ctx) {
    ctx.fillStyle = this.backgroundColour;
    ctx.fillRect(0, 0, this.width * this.game.TILE_SIZE, this.height * this.game.TILE_SIZE);
    for (const block of this.blocks) {
      block.draw(ctx);
    }
  }
  
  async reset() {
    await this.createBlocks();
    await this.createTargets();
    this.isReady = true;
  }
}
