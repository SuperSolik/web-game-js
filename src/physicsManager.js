import {Vec} from "./entities";

export class PhysicsManager {
    constructor(mapManager){
        this.mapManager = mapManager;
    }

    updateBullets(bullet) {
        if (bullet instanceof Array) {
            bullet.forEach(b => this.updateBullets(b));
        } else {
            bullet.pos = bullet.pos.plus(bullet.vel);
            this.mapCollide(bullet);
        }
    }

    updateUnit(obj) {
        this.mapCollide(obj);
    }

    // check(actorsArray, bullets){
    //     actorsArray.forEach(e => {
    //
    //     })
    // }

    mapCollide(obj) {
        if (obj.pos.y + obj.height > this.mapManager.height) {
            obj.pos = new Vec(obj.pos.x, this.mapManager.height - obj.height);
        }

        if (obj.pos.y < 0) {
            obj.pos = new Vec(obj.pos.x, 0);
        }

        if (obj.pos.x < 0) {
            obj.pos = new Vec(0, obj.pos.y);
        }

        if (obj.pos.x + obj.width > this.mapManager.width) {
            obj.pos = new Vec(this.mapManager.width - obj.width, obj.pos.y);
        }
    }

    checkCollision(obj1, obj2) {
        return obj1.pos.x <= obj2.pos.x + obj2.width &&
            obj1.pos.x + obj1.width >= obj2.pos.x &&
            obj1.pos.y <= obj2.pos.y + obj2.height &&
            obj1.pos.y + obj1.height >= obj2.pos.y;
    }
}
