class Target extends Actor {
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
