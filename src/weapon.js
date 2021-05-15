class Weapon extends Sprite {
  constructor(game, parent) {
    super(game);
    
    this.parent = parent;
    
    this.pos = new Vector2();
    this.image = this.game.SPRITESHEETS["weapon"][0];
    this.rect = new Rect(
      0,
      0,
      this.image.width,
      this.image.height,
    );
    this.hitbox = new Rect(0, 0, 32, 8);
    this.direction = parent.direction;
    
    this.game.actors.add(this);
  }
  
  update() {
    this.direction = this.parent.direction;
    if (this.direction === this.game.DIR_LEFT) {
      this.rect.right = this.parent.rect.centrex;
    } else {
      this.rect.left = this.parent.rect.centrex;
    }
    this.rect.centrey = this.parent.rect.centrey;
    this.pos.x = this.rect.left;
    this.pos.y = this.rect.bottom;
  }
  
  die() {
    this.kill();
  }
}
