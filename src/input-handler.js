class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = new Set();
    window.addEventListener("keydown", (event) => this.updateKey(event));
    window.addEventListener("keyup", (event) => this.updateKey(event));
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
}
