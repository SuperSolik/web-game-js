export class Vec {
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
}

export class Unit {
    constructor(pos, vel, width = 0, height = 0, sprite = null) {
        this.pos = pos;
        this.vel = vel;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
        this.destroy = false;
    }
}

class Bullet extends Unit {
    constructor(pos, vel, width = 10, height = 10, sprite = null) {
        super(pos, vel, width, height, sprite);
        this.fromPlayer = false;
    }

    static createBullet(startPos, endPos, sprite) {
        const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
        const speed = 8;
        return new Bullet(
            new Vec(startPos.x, startPos.y),
            new Vec(speed * Math.cos(angle), speed * Math.sin(angle)),
            10, 10,
            sprite);
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

export class Player extends Unit {
    moveLeft() {
        this.pos = this.pos.plus(new Vec(-this.vel.x, 0));
    }

    moveRight() {
        this.pos = this.pos.plus(new Vec(this.vel.x, 0));
    }

    moveUp() {
        this.pos = this.pos.plus(new Vec(0, -this.vel.y));
    }

    moveDown() {
        this.pos = this.pos.plus(new Vec(0, this.vel.y));
    }

    shoot(bullets, endPos) {
        const b = Bullet.createBullet(
            this.pos.plus(new Vec(this.width / 2 - 5, this.height / 2 - 5)),
            endPos.plus(new Vec(this.width / 2 - 5, this.height / 2 - 5).multiply(-1)),
            this.width,
            this.height);
        b.fill = "yellow";
        b.fromPlayer = true;
        bullets.push(b);
    }
}

export class Enemy extends Unit {
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
                this.pos.plus(new Vec(this.width / 2 - 5, this.height / 2 - 5)),
                endPos.plus(new Vec(this.width / 2 - 5, this.height / 2 - 5).multiply(-1)),
                this.width,
                this.height);
            b.fill = "blue";
            b.fromPlayer = false;
            bullets.push(b);
            this.shooting = false;
        }
    }
}
