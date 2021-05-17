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
    ctx.drawImage(this.image, rect.x, rect.y, rect.width, rect.height);
  }
  
  switchAnimation(newAnimation) {
    for (const animation of Object.values(this.animations)) {
      if (animation === newAnimation) {
        continue;
      }
      animation.stop();
    }
    newAnimation.start();
  }
  
  kill() {
    // Remove this Sprite from all SpriteGroups
    for (const group of this.groups) {
      group.remove(this);
    }
    // Stop any existing Animation
    if (this.hasOwnProperty("animation")) {
      this.animation.stop();
    }
  }
}
