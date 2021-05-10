class Game {
  constructor() {
    this.FPS = 30;
    this.TIMESTEP = 1000 / this.FPS;
    this.MAX_STEPS = this.FPS * 4;
    
    this.DIR_LEFT = -1;
    this.DIR_RIGHT = +1;
    
    
    this.running = false;
    this.state = GameState.NOT_RUNNING;
    this.delta = 0;
    this.lastFrame = 0;
    
    this.actors = new Set();
    
    this.canvas = document.getElementById("canvas");
    window.addEventListener("resize", () => this.updateCanvasSize());
    this.updateCanvasSize();
  }
  updateCanvasSize() {
    const rect = document.documentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
  start() {
    this.running = true;
    this.state = GameState.IN_GAME;
    requestAnimationFrame(this.run.bind(this));
  }
  panic() {
    this.delta = 0;
  }
  
  run(timestamp) {
    if (!this.running) {
      this.state = GameState.NOT_RUNNING;
      return;
    }
    
    if (timestamp < this.lastFrame + this.TIMESTEP) {
      requestAnimationFrame(this.run.bind(this));
      return;
    }
    
    this.delta += timestamp - this.lastFrame;
    this.lastFrame = timestamp;
    
    let steps = 0;
    while (this.delta >= this.TIMESTEP) {
      this.update(this.TIMESTEP);
      
      this.delta -= this.TIMESTEP;
      if (steps++ >= this.MAX_STEPS) {
        this.panic();
        break;
      }
    }
    this.draw();
    requestAnimationFrame(this.run.bind(this));
  }
  
  update(delta) {
    switch (this.state) {
      case GameState.IN_GAME:
        for (const actor of this.actors) {
          actor.update();
        }
        break;
    }
  }
  draw() {
    switch (this.state) {
      case GameState.IN_GAME:
        for (const actor of this.actors) {
          actor.draw();
        }
        break;
    }
  }
}
