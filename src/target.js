class Target extends Actor {
  hitActor(actor) {
    if (actor instanceof Player) {
      if (actor.isAttacking) {
        this.die();
      } else {
        actor.hurt();
      }
    }
  }
}
