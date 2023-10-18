const gravity = 0.6;

const backgroundSpritePath = "../img/background/background.png";
const defaultObjectSpritePath = "../img/objects/square.svg";

class Sprite{
    constructor({position, velocity, source, scale, offset, sprites}){
        this.position = position;
        this.velocity = velocity;
        this.scale = scale || 1;
        this.image = new Image();
        this.image.src = source || defaultObjectSpritePath;
        this.width = this.image.width * this.scale;
        this.height = this.image.height * this.scale;
        this.offset = offset || {x: 0, y: 0};
        this.sprites = sprites || {idle: {src: this.image.src, totalSpriteFrames: 1, framesPerSpriteFrame: 1}};
        this.currentSprite = this.sprites.idle;
        this.elapsedTime = 0;
        this.currentSpriteFrame = 0;
        this.totalSpriteFrames = this.currentSprite.totalSpriteFrames;
        this.framesPerSpriteFrame = this.sprites.idle.framesPerSpriteFrame;
    };

    setSprite(sprite){
        this.currentSprite = this.sprites[sprite];

        if(!this.currentSprite){
            this.currentSprite = this.sprites.idle;
        }
    };

    loadSprite(){
        let previousSprite = this.image.src;

        this.image = new Image();
        this.image.src  = this.currentSprite.src;
        this.width = this.image.width * this.scale;
        this.height = this.image.height * this.scale;
        this.totalSpriteFrames = this.currentSprite.totalSpriteFrames;

        let newSprite = this.image.src;

        if(previousSprite != newSprite){
            let previousSpriteImage = new Image();
            previousSprite.src = previousSprite;

            this.position.y += (previousSpriteImage.height - this.image.height) * this.scale;
        };
    };

    draw(){
        ctx.imageSmoothingEnabled = false;
        ctx.save();

        ctx.translate(this.position.x + this.offset.x, this.position.y + this.offset.y);

        ctx.drawImage(
            this.image,
            this.currentSpriteFrame * this.image.width / this.totalSpriteFrames,
            0,
            this.image.width / this.totalSpriteFrames,
            this.image.height,
            0,
            0,
            this.width / this.totalSpriteFrames,
            this.height,
        );

        ctx.restore();
    };

    animate(){
        this.elapsedTime++;

        if(this.elapsedTime >= this.framesPerSpriteFrame){
            this.currentSpriteFrame++;

            if(this.currentSpriteFrame >= this.totalSpriteFrames){
                this.currentSpriteFrame = 0;
            };

            this.elapsedTime = 0;
        };
    };

    update(){
        this.draw();
        this.animate();
    };
};

class Fighter extends Sprite {
    constructor({position, velocity, scale, sprites}){
        super({
            position,
            velocity,
            scale,
            sprites
        });

        this.velocity = velocity;

        this.isAttacking;
        this.attackCooldown = 500;
        this.onAttackCooldown;

        this.lastKeyPressed;
        this.onGround;
    };

    gravity(){
        if(Math.ceil(this.position.y + this.height >= canvas.height)){
            this.onGround = true;
        } else {
            this.onGround = false;
        };

        if(this.position.y + this.height > canvas.height){
            this.position.y = canvas.height - this.height;
            this.velocity.y = 0;
        } else {
            if(!this.onGround) this.velocity.y += gravity;
        };

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };

    update(){
        this.gravity();
        this.loadSprite();
        this.draw();
        this.animate();
    };

    attack(){
        if(this.onAttackCooldown) return

        this.isAttacking = true;
        this.onAttackCooldown = true;

        setTimeout(() => {
            this.isAttacking = false;
        }, 100);

        setTimeout(() => {
            this.onAttackCooldown = false;
        }, this.attackCooldown);
    };

    jump (){
        if(!this.onGround) return
        this.velocity.y -= 16; 
    };
};

const player = new Fighter({
    position:{
        x: 0,
        y: 0
    },
    velocity:{
        x: 0,
        y: 0
    },
    scale: 4,
    sprites: {
        idle:{
            src: "../img/player/idle.png",
            totalSpriteFrames: 11,
            framesPerSpriteFrame: 18
        }
    }
});

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    source: backgroundSpritePath
});