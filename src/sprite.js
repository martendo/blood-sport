class Sprite {
  constructor(game) {
    this.game = game;
    
    this.groups = new Set();
    
    this.direction = this.game.DIR_RIGHT;
  }
  
  draw(ctx) {
    const rect = new Rect(this.rect);
    rect.x -= this.game.map.camera.pos.x;
    rect.y -= this.game.map.camera.pos.y;
    
    if (this.direction === this.game.DIR_LEFT) {
      // Images are right-facing, flip them horizontally
      ctx.scale(-1, 1);
      rect.left = rect.right * -1;
      ctx.drawImage(this.image, rect.x, rect.y, rect.width, rect.height);
      rect.left = Math.floor(this.pos.x);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      ctx.drawImage(this.image, rect.x, rect.y, rect.width, rect.height);
    }
  }
  
  kill() {
    // Remove this Sprite from all SpriteGroups
    for (const group of this.groups) {
      group.remove(this);
    }
  }
}
