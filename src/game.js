class Game {
  constructor() {
    // Game constants
    
    this.TITLE = document.title;
    
    this.PADDING = 15;
    
    this.FPS = 60;
    this.TIMESTEP = 1000 / this.FPS;
    this.MAX_STEPS = this.FPS * 4;
    this.DISPLAY_SCALE = 4;
    
    this.DIR_UP = 0;
    this.DIR_DOWN = 1;
    this.DIR_LEFT = 2;
    this.DIR_RIGHT = 3;
    
    this.COLLISION_OFFSET = 4;
    
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
    
    this.setup();
  }
  
  async loadTilesets() {
    this.TILESETS = {};
    
    await this.loadTileset(1, "{{ BASE64:img/tilesets/1.png }}");
  }
  
  async loadTileset(name, src) {
    const img = await this.loadImage(src);
    
    const tileset = [];
    const tileWidth = Math.floor(img.width / this.TILE_SIZE);
    const tileHeight = Math.floor(img.height / this.TILE_SIZE);
    for (let y = 0; y < tileHeight; y++) {
      for (let x = 0; x < tileWidth; x++) {
        const subcanvas = document.createElement("canvas");
        subcanvas.width = this.TILE_SIZE;
        subcanvas.height = this.TILE_SIZE;
        subcanvas.getContext("2d").drawImage(img, x * this.TILE_SIZE, y * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE, 0, 0, subcanvas.width, subcanvas.height);
        tileset.push(subcanvas);
      }
    }
    this.TILESETS[name] = tileset;
  }
  
  async loadSpritesheets() {
    this.SPRITESHEETS = {};
    
    await this.loadSpritesheet("goddard", "{{ BASE64:img/goddard.png }}", 16, 32);
    await this.loadSpritesheet("targets/subject-a", "{{ BASE64:img/targets/subject-a.png }}", 16, 32);
    await this.loadSpritesheet("targets/subject-b", "{{ BASE64:img/targets/subject-b.png }}", 16, 16);
    await this.loadSpritesheet("targets/subject-c", "{{ BASE64:img/targets/subject-c.png }}", 16, 32);
    await this.loadSpritesheet("weapon", "{{ BASE64:img/weapon.png }}", 64, 64);
  }
  async loadSpritesheet(name, src, width, height) {
    const spritesheet = await this.loadImage(src);
    
    const frames = [];
    for (let y = 0; y < Math.floor(spritesheet.height / height); y++) {
      for (let x = 0; x < Math.floor(spritesheet.width / width); x++) {
        const subcanvas = document.createElement("canvas");
        subcanvas.width = width;
        subcanvas.height = height;
        subcanvas.getContext("2d").drawImage(spritesheet, x * width, y * height, width, height, 0, 0, subcanvas.width, subcanvas.height);
        frames.push(subcanvas);
      }
    }
    this.SPRITESHEETS[name] = frames;
  }
  
  async setup () {
    await this.loadSpritesheets();
    await this.loadTilesets();
    
    this.buttons = new Set();
    this.titleScreen = new TitleScreen(this);
    this.endScreen = new EndScreen(this);
    
    this.map = new GameMap(this);
    this.actors = new SpriteGroup();
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
    if (!this.inputHandler.pointer.clicked) {
      return;
    }
    for (const button of this.buttons) {
      if (button.enabled && button.isHovered()) {
        button.click();
      }
    }
  }
  
  update(delta) {
    this.inputHandler.update();
    switch (this.state) {
      case GameState.IN_GAME:
        if (!this.map.isReady) {
          break;
        }
        
        this.map.update();
        this.player.update();
        
        if (this.map.targets.count < 1) {
          this.endScreen.show();
        }
        
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
      case GameState.END_SCREEN:
        this.endScreen.draw(this.displayCtx);
        break;
      case GameState.IN_GAME:
        if (!this.map.isReady) {
          break;
        }
        
        this.map.draw(this.ctx);
        this.actors.draw(this.ctx);
        this.displayCtx.drawImage(this.canvas, 0, 0, this.displayCanvas.width, this.displayCanvas.height);
        
        this.displayCtx.fillStyle = "#ffffff";
        this.displayCtx.fillRect(this.displayCanvas.width + 2, -3, -250, 75);
        this.displayCtx.strokeStyle = "#000000";
        this.displayCtx.lineWidth = 3;
        this.displayCtx.strokeRect(this.displayCanvas.width + 2, -3, -250, 75);
        this.displayCtx.fillStyle = "#000000";
        this.drawText({
          ctx: this.displayCtx,
          text: `Gleaned: ${this.player.gleaned}`,
          x: this.displayCanvas.width - this.PADDING,
          y: this.PADDING,
          font: "40px sans-serif",
          textAlign: "end",
          textBaseline: "top",
        });
        break;
    }
  }
}
