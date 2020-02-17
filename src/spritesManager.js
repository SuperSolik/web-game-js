export class SpritesManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.sprites = null;
    this.spritesInfo = null;
    this.bulletsSprites = {};
  }

  async init() {
    this.sprites = new Image();

    await new Promise(resolve => {
      this.sprites.onload = () => resolve("ok");
      this.sprites.src = "sprites/set.png";
    });

    await new Promise(resolve => {
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

    await new Promise(resolve => {
      let res = fetch("data/entities.json")
      .then(res => res.json())
      .then(res => {
        this.spritesInfo = res;
        resolve("ok");
      })
      .catch(err => err);
    });
  }

  clear() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  draw(obj) {
    if (obj instanceof Array) {
      obj.forEach(o => this.draw(o));
    } else {
      obj.draw({
        ctx: this.ctx,
        bulletsSprites: this.bulletsSprites,
        gameSprites: this.sprites,
        gameSpriteInfo: this.spritesInfo
      });
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

