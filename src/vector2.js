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
  set x(value) {
    this._x = Math.floor(value);
  }
  set y(value) {
    this._y = Math.floor(value);
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
}
