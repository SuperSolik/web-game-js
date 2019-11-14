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
    }
}

export class Player extends Unit {
    constructor(pos, vel, width = 0, height = 0, sprite = null) {
        super(pos, vel, width, height, sprite);
    }

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
        const angle = Math.atan2(endPos.y - this.pos.y, endPos.x - this.pos.x);
        const b = new Unit(
            new Vec(this.pos.x + this.width / 2 - 5, this.pos.y + this.height / 2 - 5),
            new Vec(10 * Math.cos(angle), 10 * Math.sin(angle)),
            10, 10);

        b.fill = "yellow";
        bullets.push(b);
    }
}
