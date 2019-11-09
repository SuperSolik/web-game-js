class SpritesManager {
    constructor(ctx) {
        this.ctx = ctx;
    }

    clear(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    draw(obj){
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(obj.pos.x, obj.pos.y, obj.width, obj.height);
    }
}
