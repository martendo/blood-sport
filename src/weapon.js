class Weapon extends Sprite {
  constructor(game, parent) {
    super(game);
    
    this.SPRITESHEET = this.game.SPRITESHEETS["weapon"];
    
    this.parent = parent;
    
    this.pos = new Vector2();
    this.animation = new Animation(this, this.game, {
      images: [0, 1, 2, 3, 4, 5, 6, 7],
      duration: [30, 30, 30, 30, 30, 30, 30],
    });
    this.image = this.animation.currentImage;
    this.rect = new Rect(
      0,
      0,
      this.image.width,
      this.image.height,
    );
    this.hitbox = new Rect(2, 2, 60, 60);
    if (this.parent.vel.y < 0) {
      if (this.parent.vel.x < 0) {
        this.animation.frame = 7;
      } else if (this.parent.vel.x > 0) {
        this.animation.frame = 1;
      } else {
        this.animation.frame = 0;
      }
    } else if (this.parent.vel.y > 0) {
      if (this.parent.vel.x < 0) {
        this.animation.frame = 5;
      } else if (this.parent.vel.x > 0) {
        this.animation.frame = 3;
      } else {
        this.animation.frame = 4;
      }
    } else {
      if (this.parent.vel.x < 0) {
        this.animation.frame = 6;
      } else if (this.parent.vel.x > 0) {
        this.animation.frame = 2;
      } else {
        this.animation.frame = 0;
      }
    }
    this.animation.start();
    
    this.game.actors.add(this);
  }
  
  update() {
    this.rect.centrex = this.parent.rect.centrex;
    this.rect.centrey = this.parent.rect.centrey;
    this.pos.x = this.rect.left;
    this.pos.y = this.rect.bottom;
  }
  
  die() {
    this.kill();
  }
}
