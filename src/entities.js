class Entity{
    pos = {
        x: null,
        y: null,
        dx: 0,
        dy: 0,
    };

    constructor(x, y, width=0, height=0, sprite=null){
        this.pos.x = x;
        this.pos.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
    }
}
