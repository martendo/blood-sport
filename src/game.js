class Game {
  constructor() {
    // Game constants
    
    this.TITLE = document.title;
    
    this.FPS = 60;
    this.TIMESTEP = 1000 / this.FPS;
    this.MAX_STEPS = this.FPS * 4;
    this.DISPLAY_SCALE = 4;
    
    this.DIR_LEFT = -1;
    this.DIR_RIGHT = +1;
    
    this.IMAGE_SRCS = {
      "{{ BASE64:img/goddard.png }}": "goddard",
    };
    
    // Game setup
    
    this.running = false;
    this.state = GameState.NOT_RUNNING;
    this.delta = 0;
    this.lastFrame = 0;
    
    this.inputHandler = new InputHandler(this);
    
    this.titleScreen = new TitleScreen(this);
    
    this.actors = new Set();
    
    this.displayCanvas = document.getElementById("displayCanvas");
    this.displayCtx = this.displayCanvas.getContext("2d");
    window.addEventListener("resize", () => this.updateCanvasSize());
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.updateCanvasSize();
    
    this.IMAGES = {};
    Promise.all(Object.keys(this.IMAGE_SRCS).map(this.loadImage)).then((images) => {
      images.forEach((img) => {
        this.IMAGES[this.IMAGE_SRCS[img.src]] = img;
      });
      this.setup();
    });
  }
  
  setup () {
    this.actors = new Set();
    this.player = new Player(this);
    
    this.start();
  }
  
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", () => reject());
      img.src = src;
    });
  }
  
  drawText({text, x, y, font, textAlign, textBaseline}) {
    if (font != null) {
      this.displayCtx.font = font;
    }
    if (textAlign != null) {
      this.displayCtx.textAlign = textAlign;
    }
    if (textBaseline != null) {
      this.displayCtx.textBaseline = textBaseline;
    }
    this.displayCtx.fillText(text, x, y);
  }
  
  updateCanvasSize() {
    const rect = document.documentElement.getBoundingClientRect();
    this.displayCanvas.width = rect.width;
    this.displayCanvas.height = rect.height;
    this.canvas.width = rect.width / this.DISPLAY_SCALE;
    this.canvas.height = rect.height / this.DISPLAY_SCALE;
    this.displayCtx.imageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
  }
  
  start() {
    this.running = true;
    this.state = GameState.TITLE_SCREEN;
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.displayCtx.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
    
    switch (this.state) {
      case GameState.TITLE_SCREEN:
        this.titleScreen.draw();
        break;
      case GameState.IN_GAME:
        for (const actor of this.actors) {
          actor.draw();
        }
        this.displayCtx.drawImage(this.canvas, 0, 0, this.displayCanvas.width, this.displayCanvas.height);
        break;
    }
  }
}
