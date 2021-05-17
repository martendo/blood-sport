class Weapon extends Sprite {
  constructor(game, parent) {
    super(game);
    
    this.SPRITESHEET = this.game.SPRITESHEETS["weapon"];
    
    this.parent = parent;
    
    this.pos = new Vector2();
    this.animations = {
      up: new Animation(this, this.game, {
        images: [0, 1, 2, 3, 4, 5, 6],
        duration: [15, 15, 15, 15, 15, 15, 15],
      }),
      down: new Animation(this, this.game, {
        images: [7, 8, 9, 10, 11, 12, 13],
        duration: [15, 15, 15, 15, 15, 15, 15],
      }),
      left: new Animation(this, this.game, {
        images: [14, 15, 16, 17, 18, 19, 20],
        duration: [15, 15, 15, 15, 15, 15, 15],
      }),
      right: new Animation(this, this.game, {
        images: [21, 22, 23, 24, 25, 26, 27],
        duration: [15, 15, 15, 15, 15, 15, 15],
      }),
    };
    this.hitboxes = {
      up: new Rect(13, 2, 6, 30),
      down: new Rect(13, 0, 6, 30),
      left: new Rect(2, 13, 30, 6),
      right: new Rect(0, 13, 30, 6),
    };
    this.image = this.animations.right.currentImage;
    this.rect = new Rect(
      0,
      0,
      this.image.width,
      this.image.height,
    );
    this.hitbox = this.hitboxes.right;
    this.direction = parent.direction;
    this.animations.right.start();
    
    this.game.actors.add(this);
  }
  
  update() {
    this.direction = this.parent.direction;
    
    let animation;
    if (this.direction === this.game.DIR_UP) {
      this.rect.centrex = this.parent.rect.centrex;
      this.rect.bottom = this.parent.rect.centrey;
      animation = this.animations.up;
      this.hitbox = this.hitboxes.up;
    } else if (this.direction === this.game.DIR_DOWN) {
      this.rect.centrex = this.parent.rect.centrex;
      this.rect.top = this.parent.rect.centrey;
      animation = this.animations.down;
      this.hitbox = this.hitboxes.down;
    } else if (this.direction === this.game.DIR_LEFT) {
      this.rect.centrey = this.parent.rect.centrey;
      this.rect.right = this.parent.rect.centrex;
      animation = this.animations.left;
      this.hitbox = this.hitboxes.left;
    } else if (this.direction === this.game.DIR_RIGHT) {
      this.rect.centrey = this.parent.rect.centrey;
      this.rect.left = this.parent.rect.centrex;
      animation = this.animations.right;
      this.hitbox = this.hitboxes.right;
    }
    this.switchAnimation(animation);
    this.image = animation.currentImage;
    
    this.pos.x = this.rect.left;
    this.pos.y = this.rect.bottom;
  }
  
  die() {
    this.kill();
  }
}
