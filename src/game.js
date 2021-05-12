class Game {
  constructor() {
    // Game constants
    
    this.TITLE = document.title;
    
    this.FPS = 60;
    this.TIMESTEP = 1000 / this.FPS;
    this.MAX_STEPS = this.FPS * 4;
    this.DISPLAY_SCALE = 4;
    
    this.GRAVITY = 0.25;
    this.MAX_VELY = 8;
    
    this.DIR_LEFT = -1;
    this.DIR_RIGHT = +1;
    
    this.IMAGE_SRCS = {
      "{{ BASE64:img/goddard.png }}": "goddard",
    };
    
    this.TILE_SIZE = 8;
    
    // Game setup
    
    this.running = false;
    this.state = GameState.NOT_RUNNING;
    this.delta = 0;
    this.lastFrame = 0;
    
    this.inputHandler = new InputHandler(this);
    
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
      this.loadTileset();
    });
  }
  
  loadTileset() {
    this.TILESET = [];
    this.loadImage("{{ BASE64:img/tiles.png }}").then((img) => {
      this.extractTilesetTiles(img);
      this.setup();
    });
  }
  extractTilesetTiles(img) {
    const tileWidth = Math.floor(img.width / this.TILE_SIZE);
    const tileHeight = Math.floor(img.height / this.TILE_SIZE);
    for (let y = 0; y < tileHeight; y++) {
      for (let x = 0; x < tileWidth; x++) {
        const subcanvas = document.createElement("canvas");
        subcanvas.width = this.TILE_SIZE;
        subcanvas.height = this.TILE_SIZE;
        subcanvas.getContext("2d").drawImage(img, x * this.TILE_SIZE, y * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE, 0, 0, subcanvas.width, subcanvas.height);
        this.TILESET.push(subcanvas);
      }
    }
  }
  
  setup () {
    this.buttons = new Set();
    this.titleScreen = new TitleScreen(this);
    
    this.map = new GameMap(this);
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
  
  drawText({ctx, text, x, y, font, textAlign, textBaseline}) {
    if (font != null) {
      ctx.font = font;
    }
    if (textAlign != null) {
      ctx.textAlign = textAlign;
    }
    if (textBaseline != null) {
      ctx.textBaseline = textBaseline;
    }
    ctx.fillText(text, x, y);
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
    this.titleScreen.show();
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
    
    this.handleEvents();
    
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
  
  handleEvents() {
    if (!this.inputHandler.pointer.pressed) {
      return;
    }
    for (const button of this.buttons) {
      if (button.enabled && button.isHovered()) {
        button.click();
      }
    }
  }
  
  update(delta) {
    switch (this.state) {
      case GameState.TITLE_SCREEN:
        this.titleScreen.update();
        break;
      case GameState.IN_GAME:
        for (const actor of this.actors) {
          // Apply gravity to all actors
          if (!actor.enabled) {
            continue;
          }
          actor.vel.y += this.GRAVITY;
          if (actor.vel.y > this.MAX_VELY) {
            actor.vel.y = this.MAX_VELY;
          }
        }
        this.player.update();
        break;
    }
  }
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.displayCtx.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
    
    switch (this.state) {
      case GameState.TITLE_SCREEN:
        this.titleScreen.draw(this.displayCtx);
        break;
      case GameState.IN_GAME:
        this.map.draw(this.ctx);
        for (const actor of this.actors) {
          actor.draw(this.ctx);
        }
        this.displayCtx.drawImage(this.canvas, 0, 0, this.displayCanvas.width, this.displayCanvas.height);
        break;
    }
  }
}
