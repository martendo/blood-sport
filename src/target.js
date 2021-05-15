class Target extends Actor {
  hitActor(actor) {
    if (actor instanceof Player) {
      if (actor.isAttacking) {
        this.kill();
      } else {
        actor.hurt();
      }
    } else if (actor instanceof Weapon) {
      this.kill();
    }
  }
}
