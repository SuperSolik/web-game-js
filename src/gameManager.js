class GameManager{
    constructor(opts) {
        this.player = new Entity(opts.canvas.width/2, opts.canvas.height/2, 25, 25);
        this.controls = eventsManager;
        this.render = new SpritesManager(opts.ctx);
        this.map = new MapManager();
        this.physics = new PhysicsManager(this.map);
        this.callbacks = opts.callbacks;
        this.gameLoop = null;
    }

    update(){
        this.render.clear();
        if(this.controls.action.left) this.player.pos.x -= 15;
        if(this.controls.action.right) this.player.pos.x += 15;
        if(this.controls.action.up) this.player.pos.y += 15;
        if(this.controls.action.down) this.player.pos.y -= 15;
        if(this.controls.action.fly) clearInterval(this.gameLoop);
        this.physics.updatePhysics(this.player);
        this.render.draw(this.player);
    };

    run(){
        this.gameLoop = setInterval(() => this.update(), 100);
    }
}
