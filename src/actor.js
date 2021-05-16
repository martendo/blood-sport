class Actor extends Sprite {
  constructor(game) {
    super(game);
    
    this.enabled = true;
    this.isDead = false;
    this.pos = new Vector2();
    this.vel = new Vector2();
    
    this.hitbox = new Rect();
    
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
    
    // Actor-Actor collision
    for (const actor of this.game.actors) {
      if (this.actorcollide(this, actor)) {
        this.hitActor(actor);
      }
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
  
  isOnGround() {
    const left = Math.floor((this.rect.x + this.hitbox.left) / this.game.TILE_SIZE);
    const right = Math.floor((this.rect.x + this.hitbox.right - 1) / this.game.TILE_SIZE);
    const under = Math.floor((this.rect.y + this.hitbox.bottom + this.game.COLLISION_OFFSET) / this.game.TILE_SIZE);
    
    // Check every block underneath the actor, from its left to right sides
    for (let x = left; x <= right; x++) {
      const block = this.game.map.getBlock(x, under);
      // If any block is solid, the actor is on ground
      if (block.isSolid) {
        return true;
      }
    }
    // No solid block under the actor
    return false;
  }
  
  actorcollide(actor1, actor2) {
    if (actor1 === actor2) {
      return false;
    }
    const hitbox1 = this.getPositionedHitbox(actor1);
    const hitbox2 = this.getPositionedHitbox(actor2);
    return hitbox1.colliderect(hitbox2);
  }
  
  die() {
    this.kill();
    this.isDead = true;
  }
  
  hitActor(actor) {
    return;
  }
}
