export class PhysicsManager {
    constructor(mapManager){
        this.mapManager = mapManager;
        this.dxMax = 15;
        this.dxForce = 0.5;
    }

    updatePlayerPhysics(player) {
        if (player.dx > this.dxMax) player.dx = this.dxMax;
        if (player.dx < -this.dxMax) player.dx = -this.dxMax;

        if (player.dx > 0) player.dx -= this.dxForce;
        if (player.dx < 0) player.dx += this.dxForce;

        player.y += player.dy;
        player.x += player.dx;

        if (player.x + player.width <= 0) player.x = this.mapManager.width;
        if (player.x > this.mapManager.width) player.x = -player.width / 2;

        const hit = this.collide(player);
        if (hit) {
            if (hit === "top") {
                player.dy = 0;
            } else {
                player.dx = -player.dx * 2;
                player.dy = -player.dy * 2;
            }
        } else {
            player.dy = -5;
        }
    }

    collide(player) {
        for (let p of this.mapManager.curLevel.platforms) {
            const isCollision = this.checkCollision(player, p);
            if (isCollision) {
                return player.y > p.y ? "top" : "usual";
            }
        }
        return false;
    }

    checkCollision(obj1, obj2) {
        return obj1.x <= obj2.x + obj2.width &&
            obj1.x + obj1.width >= obj2.x &&
            obj1.y <= obj2.y + obj2.height &&
            obj1.y + obj1.height >= obj2.y;
    }
}
