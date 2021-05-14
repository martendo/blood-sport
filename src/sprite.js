class Sprite {
  constructor() {
    this.groups = new Set();
  }
  
  draw(ctx) {
    ctx.drawImage(this.image, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
  }
  
  kill() {
    // Remove this Sprite from all SpriteGroups
    for (const group of this.groups) {
      group.remove(this);
    }
  }
}
