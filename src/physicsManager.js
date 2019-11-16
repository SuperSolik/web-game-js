import {Vec} from "./entities";

export class PhysicsManager {
    constructor(mapManager){
        this.mapManager = mapManager;
    }

    update(player, enemies, bullets) {
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
            b.pos = b.pos.plus(b.vel);
            this.mapCollide(b, true);
        });

        this.mapCollide(player);

        enemies.forEach(e => {
            const xDiff = player.pos.x - e.pos.x;
            const yDiff = player.pos.y - e.pos.y;
            const distance = Math.sqrt(xDiff ** 2 + yDiff ** 2);
            const angle = Math.atan2(yDiff, xDiff);
            e.vel = new Vec(2 * Math.cos(angle), 2 * Math.sin(angle));
            if (distance >= 300) {
                e.pos = e.pos.plus(e.vel);
            }
            if (distance < 250) {
                e.pos = e.pos.plus(e.vel.multiply(-1));
            }
            this.mapCollide(e);
        })
    }

    mapCollide(obj, kill = false) {
        if (obj.pos.y + obj.height > this.mapManager.height) {
            obj.pos = new Vec(obj.pos.x, this.mapManager.height - obj.height);
            obj.destroy = kill;
        }

        if (obj.pos.y < 0) {
            obj.pos = new Vec(obj.pos.x, 0);
            obj.destroy = kill;
        }

        if (obj.pos.x < 0) {
            obj.pos = new Vec(0, obj.pos.y);
            obj.destroy = kill;
        }

        if (obj.pos.x + obj.width > this.mapManager.width) {
            obj.pos = new Vec(this.mapManager.width - obj.width, obj.pos.y);
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
