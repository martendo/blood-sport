class Player extends Actor {
  constructor(game) {
    super(game);
    
    // Player constants
    
    this.SPRITESHEET = this.game.SPRITESHEETS["goddard"];
    
    this.ACCEL = 0.25;
    this.FRICTION = 0.125;
    this.MAX_VELX = 2;
    
    this.JUMP_VEL = 5;
    
    this.ATTACK_TIME = 105;
    
    this.START_HEALTH = 100;
    
    // Player setup
    
    this.animations = {
      idle: new Animation(this, this.game, {
        images: [0, 1],
        duration: [100, 100],
      }),
      moving: new Animation(this, this.game, {
        images: [2, 3],
        duration: [50, 50],
      }),
    };
    this.image = this.animations.idle.currentImage;
    this.setRect(new Rect(
      0,
      0,
      this.image.width,
      this.image.height,
    ));
    this.hitbox = new Rect(3, 2, 10, 30);
    
    this.reset(undefined, this.game.DIR_RIGHT);
  }
  
  update() {
    if (this.game.inputHandler.newKeys.has("Spacebar")) {
      this.attack();
    }
    
    if (this.game.inputHandler.newKeys.has("ArrowUp") && this.isOnGround()) {
      // Jump!
      this.vel.y = - this.JUMP_VEL;
    }
    
    if (this.game.inputHandler.keys.has("ArrowRight")) {
      this.vel.x += this.ACCEL;
    }
    if (this.game.inputHandler.keys.has("ArrowLeft")) {
      this.vel.x -= this.ACCEL;
    }
    
    if (this.vel.x > 0) {
      this.vel.x -= this.FRICTION;
      // Friction should not make you start moving the other way
      if (this.vel.x < 0) {
        this.vel.x = 0;
      }
    } else if (this.vel.x < 0) {
      this.vel.x += this.FRICTION;
      if (this.vel.x > 0) {
        this.vel.x = 0;
      }
    }
    
    if (this.vel.x > this.MAX_VELX) {
      this.vel.x = this.MAX_VELX;
    } else if (this.vel.x < -this.MAX_VELX) {
      this.vel.x = -this.MAX_VELX;
    }
    
    super.update();
    
    if (this.vel.x > 0) {
      this.direction = this.game.DIR_RIGHT;
    } else if (this.vel.x < 0) {
      this.direction = this.game.DIR_LEFT;
    }
    
    if (this.weapon != null) {
      this.weapon.update();
    }
    
    // Use the correct animation
    if (this.vel.x != 0) {
      this.animations.idle.stop();
      this.animations.moving.start();
      // Animation can change at any time, so always set the image
      this.image = this.animations.moving.currentImage;
    } else {
      this.animations.moving.stop();
      this.animations.idle.start();
      this.image = this.animations.idle.currentImage;
    }
  }
  
  attack() {
    if (this.weapon != null) {
      this.weapon.die();
      clearTimeout(this.weapon.timeout);
    }
    this.weapon = new Weapon(this.game, this);
    this.isAttacking = true;
    this.weapon.timeout = setTimeout(() => {
      this.weapon.die();
      this.weapon = null;
      this.isAttacking = false;
    }, this.ATTACK_TIME);
  }
  
  hurt(damage = 1) {
    this.health -= damage;
    if (this.health < 1) {
      this.die();
    }
  }
  
  die() {
    console.log("deadish: end");
  }
  
  reset(pos = new Vector2(), direction = null) {
    this.pos = new Vector2(pos);
    if (direction != null) {
      this.direction = direction;
    }
    
    this.health = this.START_HEALTH;
    this.gleaned = 0;
    this.weapon = null;
    this.isAttacking = false;
    for (const animation of Object.values(this.animations)) {
      animation.stop();
    }
    this.animations.idle.start();
  }
}
