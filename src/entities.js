// export class Vec {
class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    multiply(factor) {
        return new Vec(this.x * factor, this.y * factor);
    }

    copy() {
        return new Vec(this.x, this.y);
    }
}

// export class Unit {
class Unit {
    constructor(pos, vel, width = 0, height = 0, sprite = null) {
        this.pos = pos;
        this.vel = vel;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
        this.destroy = false;
        this.curFrame = 0;
        this.changeSprite = true;
        this.oldPos = null;
    }

    changeSpriteFrame(frameLen) {
        if (this.changeSprite) {
            this.curFrame = (this.curFrame + 1) % frameLen;
            this.changeSprite = false;
        }
    }

    savePos() {
        this.oldPos = this.pos.copy();
    }

    restorePos() {
        this.pos = this.oldPos;
    }

    update() {
        this.pos = this.pos.plus(this.vel);
    }
}

// export class Bullet extends Unit {
class Bullet extends Unit {
    static get SIZE() {
        return 20;
    }

    constructor(pos, vel, width, height, sprite = null) {
        super(pos, vel, width, height, sprite);
        this.fromPlayer = false;
        this.angle = 0;
    }

    static createBullet(startPos, endPos, sprite = 'red', isPlayer = false) {
        const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
        const speed = 10;
        const b = new Bullet(
            new Vec(startPos.x + 10 * Math.cos(angle), startPos.y + 10 * Math.sin(angle)),
            new Vec(speed * Math.cos(angle), speed * Math.sin(angle)),
            Bullet.SIZE,
            Bullet.SIZE,
            sprite);
        b.angle = angle;
        b.fromPlayer = isPlayer;
        return b;
    }

    hit(obj) {
        if (this.fromPlayer && obj instanceof Enemy) {
            obj.destroy = true;
            this.destroy = true;
        } else {
            if (!this.fromPlayer && obj instanceof Player) {
                obj.destroy = true;
                this.destroy = true;
            }
        }
    }
}

// export class Player extends Unit {
class Player extends Unit {
    moveLeft() {
        this.vel = new Vec(-6, this.vel.y);
    }

    moveRight() {
        this.vel = new Vec(6, this.vel.y);
    }

    moveUp() {
        this.vel = new Vec(this.vel.x, -6);
    }

    moveDown() {
        this.vel = new Vec(this.vel.x, 6);
    }

    stopX() {
        this.vel = new Vec(0, this.vel.y);
    }

    stopY() {
        this.vel = new Vec(this.vel.x, 0);
    }

    shoot(bullets, endPos) {
        const b = Bullet.createBullet(
            this.pos.plus(new Vec(this.width / 2 - Bullet.SIZE / 2, this.height / 2 - Bullet.SIZE / 2)),
            endPos.plus(new Vec(this.width / 2 - Bullet.SIZE / 2, this.height / 2 - Bullet.SIZE / 2).multiply(-1)),
            'yellow',
            true);
        bullets.push(b);
    }
}

// export class Enemy extends Unit {
class Enemy extends Unit {
    constructor(pos, vel, width = 0, height = 0, sprite = null) {
        super(pos, vel, width, height, sprite);
        this.shooting = false;
        setTimeout(() => {
            this.shooting = true;
        }, 1000);
    }

    shoot(bullets, endPos) {
        if (this.shooting) {
            const b = Bullet.createBullet(
                this.pos.plus(new Vec(this.width / 2 - Bullet.SIZE / 2, this.height / 2 - Bullet.SIZE / 2)),
                endPos.plus(new Vec(this.width / 2 - Bullet.SIZE / 2, this.height / 2 - Bullet.SIZE / 2)),);
            bullets.push(b);
            this.shooting = false;
        }
    }
}
