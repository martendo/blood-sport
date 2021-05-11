class Vector2 {
  constructor(x = null, y = null) {
    if (x instanceof Vector2 && y == null) {
      // Passed a Vector2 -> clone it
      this.x = x.x;
      this.y = x.y;
    } else {
      // Passed x and y
      this.x = x || 0;
      this.y = y || 0;
    }
  }
}
