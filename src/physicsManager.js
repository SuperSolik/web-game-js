import {Bullet, Enemy, Player, Vec} from "./entities";

export class PhysicsManager {
  constructor(map) {
    this.map = map;
    this.isTouchExit = false;
  }

  handleBullet(b, actors) {
    const player = actors[0];
    if (this.collide(b, player)) {
      b.hit(player);
    }

    for (let a of actors) {
      if (this.collide(b, a)) {
        b.hit(a);
        break
      }
    }
    this.move(b, true);
  }

  handleEnemy(e, player) {
    const xDiff = player.pos.x - e.pos.x;
    const yDiff = player.pos.y - e.pos.y;
    const distance = Math.sqrt(xDiff ** 2 + yDiff ** 2);
    const angle = Math.atan2(yDiff, xDiff);
    const vel = new Vec(4 * Math.cos(angle), 4 * Math.sin(angle));
    if (distance >= 300) {
      e.vel = vel;
    } else if (distance < 250) {
      e.vel = vel.multiply(-1);
    } else {
      e.vel = new Vec(0, 0);
    }
    this.move(e);
  }

  update(objects) {
    const player = objects[0];
    this.move(player);

    for (let obj of objects.slice(1, objects.length)) {
      if (obj instanceof Enemy) {
        this.handleEnemy(obj, player);
      }
      if (obj instanceof Bullet) {
        this.handleBullet(obj, objects);
      }
    }
  }


  move(obj, kill = false) {
    obj.savePos();
    obj.update();

    if (obj instanceof Player) {
      this.isTouchExit = this.touchExit(obj);
    }

    const scale = !(obj instanceof Bullet) ? 1.5 : 3;
    if (this.map.isWall(obj.pos.x, obj.pos.y + obj.height / scale)
      || this.map.isWall(obj.pos.x + obj.width, obj.pos.y + obj.height / scale)
      || this.map.isWall(obj.pos.x, obj.pos.y + obj.height)
      || this.map.isWall(obj.pos.x + obj.width, obj.pos.y + obj.height)) {
      obj.restorePos();
      obj.destroy = kill;
    }
  }

  touchExit(obj) {
    const scale = !(obj instanceof Bullet) ? 1.5 : 3;
    return this.map.isExit(obj.pos.x, obj.pos.y + obj.height / scale)
      || this.map.isExit(obj.pos.x + obj.width, obj.pos.y + obj.height / scale)
      || this.map.isExit(obj.pos.x, obj.pos.y + obj.height)
      || this.map.isExit(obj.pos.x + obj.width, obj.pos.y + obj.height);
  }


  collide(obj1, obj2) {
    return obj1.pos.x <= obj2.pos.x + obj2.width &&
      obj1.pos.x + obj1.width >= obj2.pos.x &&
      obj1.pos.y <= obj2.pos.y + obj2.height &&
      obj1.pos.y + obj1.height >= obj2.pos.y;
  }
}
