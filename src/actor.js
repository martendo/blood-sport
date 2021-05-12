class Actor extends Sprite {
  constructor(game, hitbox, pos = null) {
    super();
    
    this.game = game;
    
    this.enabled = true;
    this.pos = new Vector2(pos);
    this.vel = new Vector2();
    this.direction = this.game.DIR_LEFT;
    
    this.hitbox = hitbox;
    
    this.game.actors.add(this);
  }
  
  setRect(rect) {
    this.rect = rect;
    this.rect.left = Math.floor(this.pos.x);
    this.rect.bottom = Math.floor(this.pos.y);
  }
  
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    
    let block;
    
    this.rect.left = Math.floor(this.pos.x);
    block = this.blockColliding();
    if (block != null) {
      if (this.vel.x > 0) {
        this.pos.x = block.rect.left - this.hitbox.right;
      } else if (this.vel.x < 0) {
        this.pos.x = block.rect.right - this.hitbox.left;
      }
      this.collidedX();
    }
    
    // End of map
    const mapWidthPx = this.game.map.width * this.game.TILE_SIZE;
    if (this.pos.x + this.hitbox.left < 0) {
      this.pos.x = 0 - this.hitbox.x;
      this.collidedX();
    } else if (this.pos.x + this.hitbox.right > mapWidthPx) {
      this.pos.x = mapWidthPx - this.hitbox.right;
      this.collidedX();
    }
    
    this.rect.bottom = Math.floor(this.pos.y);
    block = this.blockColliding();
    if (block != null) {
      if (this.vel.y > 0) {
        this.pos.y = block.rect.top + (this.rect.height - this.hitbox.bottom);
      } else if (this.vel.y < 0) {
        this.pos.y = block.rect.bottom + (this.rect.height - this.hitbox.top);
      }
      this.collidedY();
    }
    
    if (Math.floor(this.rect.top / this.game.TILE_SIZE) > this.game.map.height) {
      this.die();
    }
  }
  
  getPositionedHitbox(actor) {
    return new Rect(
      actor.rect.x + actor.hitbox.x,
      actor.rect.y + actor.hitbox.y,
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
  
  collidedX() {
    this.vel.x = 0;
    this.rect.left = Math.floor(this.pos.x);
  }
  collidedY() {
    this.vel.y = 0;
    this.rect.bottom = Math.floor(this.pos.y);
  }
  
  die() {
    this.game.actors.delete(this);
  }
  
  draw(ctx) {
    if (this.direction === this.game.DIR_LEFT) {
      // Images are right-facing, flip them horizontally
      ctx.scale(-1, 1);
      this.rect.left = this.rect.right * -1;
      super.draw(ctx);
      this.rect.left = Math.floor(this.pos.x);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      super.draw(ctx);
    }
  }
}
