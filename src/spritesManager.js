export class SpritesManager {
    constructor(ctx) {
        this.ctx = ctx;
    }

    clear(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    draw(obj){
        if (obj instanceof Array) {
            obj.forEach(o => this.draw(o));
        } else {
            this.ctx.fillStyle = obj.fill || "gray";
            this.ctx.fillRect(obj.pos.x, obj.pos.y, obj.width, obj.height);
        }
    }

    drawLevel(level) {
        level.platforms.forEach((p) => this.draw(p));
    }
}
