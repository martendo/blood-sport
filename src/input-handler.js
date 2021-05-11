class InputHandler {
  constructor(game) {
    this.game = game;
    
    this.keys = new Set();
    window.addEventListener("keydown", (event) => this.updateKey(event));
    window.addEventListener("keyup", (event) => this.updateKey(event));
    
    this.pointer = {
      pos: new Vector2(),
      pressed: false,
    };
    window.addEventListener("pointerdown", (event) => this.updatePointer(event));
    window.addEventListener("pointerup", (event) => this.updatePointer(event));
    window.addEventListener("pointermove", (event) => this.updatePointer(event));
  }
  
  updateKey(event) {
    let key;
    switch (event.key) {
      case "Left":
      case "ArrowLeft":
      case "a":
        key = "ArrowLeft";
        break;
      case "Right":
      case "ArrowRight":
      case "d":
        key = "ArrowRight";
        break;
      default:
        return;
    }
    event.preventDefault();
    if (event.type === "keydown") {
      this.keys.add(key);
    } else if (event.type === "keyup") {
      this.keys.delete(key);
    }
  }
  
  updatePointer(event) {
    if (event.type !== "pointermove" && event.button !== 0) {
      return;
    }
    this.pointer.pos = new Vector2(event.clientX, event.clientY);
    if (event.type !== "pointermove") {
      this.pointer.pressed = event.type === "pointerdown";
    }
  }
}
