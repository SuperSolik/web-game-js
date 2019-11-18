import {Player, Vec} from "./entities";

export class PhysicsManager {
    constructor(map) {
        this.map = map;
    }

    update(player, enemies, bullets, actors = []) {
        // const p_ = actors.find(o => o instanceof Player);
        // const e_ = actors.filter(o => o instanceof Enemy);
        // const b_ = actors.filter(o => o instanceof Bullet);

        bullets.forEach(b => {
            if (this.collide(b, player)) {
                b.hit(player);
            }

            for (let e of enemies) {
                if (this.collide(b, e)) {
                    b.hit(e);
                    break
                }
            }
            this.move(b, true);
        });

        this.move(player);

        enemies.forEach(e => {
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
        })
    }

    move(obj, kill = false) {
        obj.savePos();
        obj.update();

        const scale = obj instanceof Player ? 1.5 : 3;
        if (this.map.isWall(obj.pos.x, obj.pos.y + obj.height / scale)
            || this.map.isWall(obj.pos.x + obj.width, obj.pos.y + obj.height / scale)
            || this.map.isWall(obj.pos.x, obj.pos.y + obj.height)
            || this.map.isWall(obj.pos.x + obj.width, obj.pos.y + obj.height)) {
            obj.restorePos();
            obj.destroy = kill;
        }
    }

    collide(obj1, obj2) {
        return obj1.pos.x <= obj2.pos.x + obj2.width &&
            obj1.pos.x + obj1.width >= obj2.pos.x &&
            obj1.pos.y <= obj2.pos.y + obj2.height &&
            obj1.pos.y + obj1.height >= obj2.pos.y;
    }
}
