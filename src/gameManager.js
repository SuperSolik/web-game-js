const {eventsManager} = require("./eventsManager");
const {SpritesManager} = require("./spritesManager");
const {PhysicsManager} = require("./physicsManager");
const {MapManager} = require("./mapManager");
const {Entity} = require("./entities");

export class GameManager {
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
        if (this.controls.action.left) this.player.dx -= 1;
        if (this.controls.action.right) this.player.dx += 1;
        if (this.controls.action.fly) this.player.dy += 15;
        this.physics.updatePlayerPhysics(this.player);
        this.render.drawLevel(this.map.curLevel);
        this.render.draw(this.player);
    };

    run(){
        this.map.nextLevel();
        this.gameLoop = setInterval(() => this.update(), 50);
    }
}
