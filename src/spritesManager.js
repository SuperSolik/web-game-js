import {Bullet} from "./entities";

export class SpritesManager {
	constructor(ctx) {
		this.ctx = ctx;
		this.sprites = null;
		this.spritesInfo = null;
		this.bulletsSprites = {};
	}

	init() {
		this.sprites = new Image();

		return new Promise(resolve => {
			this.sprites.onload = () => {
				resolve("ok");
			};
			this.sprites.src = "sprites/set.png";
		})
		.then(res => {
			return new Promise(resolve => {
				let spriteCount = 0;
				for (let color of ['red', 'yellow']) {
					const bulletSprite = new Image();
					bulletSprite.onload = () => {
						this.bulletsSprites[color] = bulletSprite;
						spriteCount++;
						if (spriteCount === 2) {
							resolve("ok");
						}
					};
					bulletSprite.src = `sprites/proj_${color}.png`;
				}
			});
		})
		.then(res => {
			return new Promise(resolve => {
				let res = fetch("data/entities.json")
				.then(res => res.json())
				.then(res => {
					this.spritesInfo = res;
					resolve("ok");
				})
				.catch(err => err);
			});
		});
	}

	clear() {
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}

	drawBullet(b) {
		let image = this.bulletsSprites[b.sprite];
		this.ctx.save();
		let scale = 2;
		this.ctx.translate(b.pos.x + b.width / 2, b.pos.y + b.height / 2);
		this.ctx.rotate(b.angle);
		this.ctx.drawImage(image,
			b.curFrame * 16, 0,
			16, 16,
			-(b.width * scale) / 2, -(b.height * scale) / 2,
			(b.width * scale), (b.height * scale),
		);
		this.ctx.restore();
		if (b.changeSprite) {
			b.changeSpriteFrame(3);
			setTimeout(() => {
				b.changeSprite = true;
			}, 125);
		}
	}

	drawUnit(unit) {
		let sprite = this.spritesInfo[unit.sprite];
		this.ctx.drawImage(this.sprites,
			sprite.x + unit.curFrame * 16, sprite.y,
			sprite.w, sprite.h,
			unit.pos.x, unit.pos.y,
			unit.width, unit.height,
		);

		if (unit.changeSprite) {
			unit.changeSpriteFrame(sprite.animLen);
			setTimeout(() => {
				unit.changeSprite = true;
			}, 125);
		}
	}
	draw(obj) {
		if (obj instanceof Array) {
			obj.forEach(o => this.draw(o));
		} else {
			if (obj instanceof Bullet) {
				this.drawBullet(obj);
			} else {
				this.drawUnit(obj);
			}
		}
	}

	drawMapBottom(map) {
		if (!map.imgLoaded || !map.jsonLoaded) {
			setTimeout(() => this.drawMapBottom(map), 100);
		}
		this.drawLevel(map, map.bottomLayer);
		this.drawLevel(map, map.middleLayer);
	}

	drawMapTop(map) {
		if (!map.imgLoaded || !map.jsonLoaded) {
			setTimeout(() => this.drawMapTop(map), 100);
		}
		this.drawLevel(map, map.topLayer);
	}

	drawLevel(map, layer) {
		for (let i = 0; i < layer.data.length; i++) {
			if (layer.data[i] !== 0) {
				let tile = map.getTile(layer.data[i]);
				let pX = (i % map.xCount) * map.tSize.x;
				let pY = Math.floor(i / map.xCount) * map.tSize.y;
				this.ctx.drawImage(
					tile.img,
					tile.px, tile.py,
					map.tSize.x, map.tSize.y,
					pX * 2, pY * 2,
					32, 32);
			}
		}
	}
}

