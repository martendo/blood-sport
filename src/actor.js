class Actor {
  constructor(game, hitbox, pos = null) {
    this.game = game;
    
    this.enabled = true;
    this.pos = new Vector2(pos);
    this.vel = new Vector2();
    this.direction = this.game.DIR_LEFT;
    
    this.hitbox = hitbox;
    
    this.game.actors.add(this);
  }
  
  update() {
    let block;
    
    this.pos.x += this.vel.x;
    block = this.blockColliding();
    if (block != null) {
      if (this.vel.x > 0) {
        this.pos.x = block.x * this.game.TILE_SIZE - this.hitbox.right;
      } else if (this.vel.x < 0) {
        this.pos.x = (block.x * this.game.TILE_SIZE + this.game.TILE_SIZE) - this.hitbox.left;
      }
      this.vel.x = 0;
    }
    
    // End of map
    const mapWidthPx = this.game.map.width * this.game.TILE_SIZE;
    if (this.pos.x + this.hitbox.left < 0) {
      this.pos.x = 0 - this.hitbox.x;
      this.vel.x = 0;
    } else if (this.pos.x + this.hitbox.right > mapWidthPx) {
      this.pos.x = mapWidthpx - this.hitbox.right;
      this.vel.x = 0;
    }
    
    this.pos.y += this.vel.y;
    block = this.blockColliding();
    if (block != null) {
      if (this.vel.y > 0) {
        this.pos.y = block.y * this.game.TILE_SIZE + (this.height - this.hitbox.bottom);
      } else if (this.vel.y < 0) {
        this.pos.y = (block.y * this.game.TILE_SIZE + this.game.TILE_SIZE) + (this.height - this.hitbox.top);
      }
      this.vel.y = 0;
    }
    
    if (Math.floor((this.pos.y - this.height) / this.game.TILE_SIZE) > this.game.map.height) {
      this.die();
    }
  }
  
  getPositionedHitbox(actor) {
    return new Rect(
      actor.pos.x + actor.hitbox.x,
      (actor.pos.y - actor.height) + actor.hitbox.y,
      actor.hitbox.width,
      actor.hitbox.height,
    );
  }
  
  blockColliding() {
    const hitbox = this.getPositionedHitbox(this);
    for (let y = hitbox.top; y < hitbox.bottom; y++) {
      for (let x = hitbox.left; x < hitbox.right; x++) {
        const tileX = Math.floor(x / this.game.TILE_SIZE);
        const tileY = Math.floor(y / this.game.TILE_SIZE);
        const block = this.game.map.getBlock(tileX, tileY);
        if (block.isSolid) {
          return block;
        }
      }
    }
    return null;
  }
  
  die() {
    this.game.actors.delete(this);
  }
  
  draw() {
    this.game.ctx.drawImage(this.image, Math.floor(this.pos.x), Math.floor(this.pos.y - this.height));
  }
}
