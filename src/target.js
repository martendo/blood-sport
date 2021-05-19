class Target extends Actor {
  constructor(game) {
    super(game);
    
    this.ESCAPE_CHANCE = 60 * this.game.FPS;
  }
  
  hitActor(actor) {
    if (actor instanceof Player) {
      if (actor.isAttacking) {
        this.die();
      } else {
        actor.hurt();
      }
    } else if (actor instanceof Weapon) {
      this.die();
    } else {
      this.hitTarget();
    }
  }
  
  update() {
    super.update();
    
    // Slim chance of escaping while off-screen
    if (!this.rect.colliderect(new Rect(
      this.game.map.camera.pos.x,
      this.game.map.camera.pos.y,
      this.game.canvas.width,
      this.game.canvas.height,
    )) && Math.floor(Math.random() * this.ESCAPE_CHANCE) == 0) {
      this.kill();
    }
  }
  
  hitTarget() {
    return;
  }
  
  die() {
    this.kill();
    if (this.isDead) {
      return;
    }
    this.game.player.gleaned++;
    this.isDead = true;
  }
}
