class Rect {
  constructor(x = null, y = null, width = null, height = null) {
    if (x instanceof Rect && y == null && width == null && height == null) {
      // Passed a Rect -> clone it
      this._x = x._x;
      this._y = x._y;
      this._width = x._width;
      this._height = x._height;
    } else {
      // Passed dimensions
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
    }
  }
  
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
  }
  get left() {
    return this._x;
  }
  set left(value) {
    this._x = value;
  }
  get right() {
    return this._x + this._width;
  }
  set right(value) {
    this._x = value - this._width;
  }
  
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
  }
  get top() {
    return this._y;
  }
  set top(value) {
    this._y = value;
  }
  get bottom() {
    return this._y + this._height;
  }
  set bottom(value) {
    this._y = value - this._height;
  }
  
  get width() {
    return this._width;
  }
  set width(value) {
    this._width = value;
  }
  get height() {
    return this._height;
  }
  set height(value) {
    this._height = value;
  }
  
  colliderect(rect) {
    return (this.left < rect.right &&
      this.right > rect.left &&
      this.top < rect.bottom &&
      this.bottom > rect.top);
  }
}
