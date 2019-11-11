export class SpritesManager {
    constructor(ctx) {
        this.ctx = ctx;
    }

    clear(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    draw(obj){
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }

    drawLevel(level) {
        level.platforms.forEach(platform => {
            this.ctx.fillStyle = "gray";
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
    }
}
