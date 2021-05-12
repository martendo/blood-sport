class Sprite {
  draw(ctx) {
    ctx.drawImage(this.image, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
  }
}
