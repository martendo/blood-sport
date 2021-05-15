class Sprite {
  constructor(game) {
    this.game = game;
    
    this.groups = new Set();
    
    this.direction = this.game.DIR_RIGHT;
  }
  
  draw(ctx) {
    if (this.direction === this.game.DIR_LEFT) {
      // Images are right-facing, flip them horizontally
      ctx.scale(-1, 1);
      this.rect.left = this.rect.right * -1;
      ctx.drawImage(this.image, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
      this.rect.left = Math.floor(this.pos.x);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      ctx.drawImage(this.image, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
  }
  
  kill() {
    // Remove this Sprite from all SpriteGroups
    for (const group of this.groups) {
      group.remove(this);
    }
  }
}
