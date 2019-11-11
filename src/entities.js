export class Entity {
    constructor(x, y, width=0, height=0, sprite=null){
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
    }
}
