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
    }
  }
  
  die() {
    this.kill();
    this.game.player.gleaned++;
  }
}
