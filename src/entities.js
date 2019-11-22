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

	copy() {
		return new Vec(this.x, this.y);
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

export class Bullet extends Unit {
	constructor(pos, vel, width, height, sprite = null) {
		super(pos, vel, width, height, sprite);
		this.fromPlayer = false;
		this.angle = 0;
	}

	static get SIZE() {
		return 20;
	}

	static createBullet(startPos, angle, sprite = 'red', isPlayer = false) {
		const speed = 10;
		const b = new Bullet(
			new Vec(startPos.x + Bullet.SIZE/2 * Math.cos(angle), startPos.y + Bullet.SIZE/2 * Math.sin(angle)),
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

export class Player extends Unit {
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

	shoot(bullets, destObjPos) {
		let startPos = this.pos.plus(new Vec(this.width / 2 - Bullet.SIZE / 2, this.height / 2 - Bullet.SIZE / 2));
		let endPos = destObjPos.plus(new Vec(this.width / 2 - Bullet.SIZE / 2, this.height / 2 - Bullet.SIZE / 2));

		const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);

		const b = Bullet.createBullet(
			startPos,
			angle,
			'yellow',
			true);
		bullets.push(b);
	}
}

export class Enemy extends Unit {
	constructor(pos, vel, width = 0, height = 0, sprite = null) {
		super(pos, vel, width, height, sprite);
		this.shooting = false;
		this.hasShotgun = false;
		setTimeout(() => {
			this.shooting = true;
		}, Math.random()*1000 + 500);
	}

	shoot(bullets, destObjPos) {
		if (this.shooting) {
			const shotsNum = this.hasShotgun ? 3 : 1;

			let startPos = this.pos.plus(new Vec(this.width / 2 - Bullet.SIZE / 2, this.height / 2 - Bullet.SIZE / 2));
			let endPos = destObjPos.plus(new Vec(this.width / 2 - Bullet.SIZE / 2, this.height / 2 - Bullet.SIZE / 2));

			const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);

			const startAngle = angle - Math.floor(shotsNum/2)*Math.PI/5;
			const endAngle = angle + Math.floor(shotsNum/2)*Math.PI/5;

			for(let angle = startAngle; angle <= endAngle; angle += Math.PI/5){
				bullets.push(Bullet.createBullet(
					startPos,
					angle
				));
			}
			this.shooting = false;
		}
	}
}
