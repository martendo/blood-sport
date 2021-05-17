class Player extends Actor {
  constructor(game) {
    super(game);
    
    // Player constants
    
    this.SPRITESHEET = this.game.SPRITESHEETS["goddard"];
    
    this.ACCEL = 0.25;
    this.FRICTION = 0.125;
    this.MAX_VEL = 2;
    
    this.ATTACK_TIME = 105;
    
    this.START_HEALTH = 100;
    
    // Player setup
    
    this.animations = {
      idleUp: new Animation(this, this.game, {
        images: [0, 1],
        duration: [100, 100],
      }),
      idleDown: new Animation(this, this.game, {
        images: [2, 3],
        duration: [100, 100],
      }),
      idleLeft: new Animation(this, this.game, {
        images: [4, 5],
        duration: [100, 100],
      }),
      idleRight: new Animation(this, this.game, {
        images: [6, 7],
        duration: [100, 100],
      }),
      movingUp: new Animation(this, this.game, {
        images: [8, 9],
        duration: [50, 50],
      }),
      movingDown: new Animation(this, this.game, {
        images: [10, 11],
        duration: [50, 50],
      }),
      movingLeft: new Animation(this, this.game, {
        images: [12, 13],
        duration: [50, 50],
      }),
      movingRight: new Animation(this, this.game, {
        images: [14, 15],
        duration: [50, 50],
      }),
    };
    this.image = this.animations.idleRight.currentImage;
    this.setRect(new Rect(
      0,
      0,
      this.image.width,
      this.image.height,
    ));
    this.hitbox = new Rect(3, 16, 10, 16);
    
    this.reset(undefined, this.game.DIR_RIGHT);
  }
  
  update() {
    if (this.game.inputHandler.newKeys.has("Spacebar")) {
      this.attack();
    }
    
    if (this.game.inputHandler.keys.has("ArrowLeft")) {
      this.vel.x -= this.ACCEL;
    }
    if (this.game.inputHandler.keys.has("ArrowRight")) {
      this.vel.x += this.ACCEL;
    }
    if (this.game.inputHandler.keys.has("ArrowUp")) {
      this.vel.y -= this.ACCEL;
    }
    if (this.game.inputHandler.keys.has("ArrowDown")) {
      this.vel.y += this.ACCEL;
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
    if (this.vel.y > 0) {
      this.vel.y -= this.FRICTION;
      if (this.vel.y < 0) {
        this.vel.y = 0;
      }
    } else if (this.vel.y < 0) {
      this.vel.y += this.FRICTION;
      if (this.vel.y > 0) {
        this.vel.y = 0;
      }
    }
    
    if (this.vel.x > this.MAX_VEL) {
      this.vel.x = this.MAX_VEL;
    } else if (this.vel.x < -this.MAX_VEL) {
      this.vel.x = -this.MAX_VEL;
    }
    if (this.vel.y > this.MAX_VEL) {
      this.vel.y = this.MAX_VEL;
    } else if (this.vel.y < -this.MAX_VEL) {
      this.vel.y = -this.MAX_VEL;
    }
    
    super.update();
    
    if (this.vel.x > 0) {
      this.direction = this.game.DIR_RIGHT;
    } else if (this.vel.x < 0) {
      this.direction = this.game.DIR_LEFT;
    } else if (this.vel.y < 0) {
      this.direction = this.game.DIR_UP;
    } else if (this.vel.y > 0) {
      this.direction = this.game.DIR_DOWN;
    }
    
    if (this.weapon != null) {
      this.weapon.update();
    }
    
    // Use the correct animation
    let animation;
    if (this.vel.y < 0) {
      animation = this.animations.movingUp;
    } else if (this.vel.y > 0) {
      animation = this.animations.movingDown;
    } else if (this.vel.x < 0) {
      animation = this.animations.movingLeft;
    } else if (this.vel.x > 0) {
      animation = this.animations.movingRight;
    } else if (this.direction === this.game.DIR_UP) {
      animation = this.animations.idleUp;
    } else if (this.direction === this.game.DIR_DOWN) {
      animation = this.animations.idleDown;
    } else if (this.direction === this.game.DIR_LEFT) {
      animation = this.animations.idleLeft;
    } else if (this.direction === this.game.DIR_RIGHT) {
      animation = this.animations.idleRight;
    }
    this.switchAnimation(animation);
    // Animation may change at any time - always set the image
    this.image = animation.currentImage;
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
    this.isDead = true;
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
    this.animations.idleRight.start();
    this.image = this.animations.idleRight.currentImage;
  }
}
