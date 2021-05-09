class Game {
  constructor() {
    this.FPS = 30;
    this.TIMESTEP = 1000 / this.FPS;
    this.MAX_STEPS = this.FPS * 4;
    
    this.running = false;
    this.delta = 0;
    this.lastFrame = 0;
    
    this.canvas = document.getElementById("canvas");
  }
  start() {
    this.running = true;
    requestAnimationFrame(this.run.bind(this));
  }
  panic() {
    this.delta = 0;
  }
  
  run(timestamp) {
    if (!this.running) {
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
    return;
  }
  draw() {
    return;
  }
}
