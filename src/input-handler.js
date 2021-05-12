class InputHandler {
  constructor(game) {
    this.game = game;
    
    this.keys = new Set();
    this.previousKeys = new Set();
    this.newKeys = new Set();
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
    // Convert everything to upper case to ignore case (e.g. Shift key pressed)
    switch (event.key.toUpperCase()) {
      case "LEFT":
      case "ARROWLEFT":
      case "A":
        key = "ArrowLeft";
        break;
      case "RIGHT":
      case "ARROWRIGHT":
      case "D":
        key = "ArrowRight";
        break;
      case "SPACEBAR":
      case " ":
        key = "Spacebar";
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
  
  update() {
    this.newKeys = new Set(this.keys);
    for (let key of this.previousKeys) {
      this.newKeys.delete(key);
    }
    this.previousKeys = new Set(this.keys);
  }
}
