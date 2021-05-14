class SpriteGroup {
  constructor() {
    this.sprites = new Set();
  }
  add(sprite) {
    this.sprites.add(sprite);
    sprite.groups.add(this);
  }
  remove(sprite) {
    this.sprites.delete(sprite);
    sprite.groups.delete(this);
  }
  empty() {
    // Remove all Sprites
    for (const sprite of this.sprites) {
      this.remove(sprite);
    }
  }
  *[Symbol.iterator]() {
    for (const sprite of this.sprites) {
      yield sprite;
    }
  }
}
