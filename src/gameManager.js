import {Player, Unit, Vec} from "./entities";

const {eventsManager} = require("./eventsManager");
const {SpritesManager} = require("./spritesManager");
const {PhysicsManager} = require("./physicsManager");
const {MapManager} = require("./mapManager");

export class GameManager {
    constructor(opts) {
        this.player = new Player(
            new Vec(opts.canvas.width / 2, opts.canvas.height / 2),
            new Vec(5, 5),
            25,
            25);
        console.log(this.player.pos.x);
        this.player.fill = "green";

        this.enemies = [];
        this.pBullets = [];
        this.eBullets = [];

        this.controls = eventsManager;
        this.render = new SpritesManager(opts.ctx);
        this.map = new MapManager();
        this.physics = new PhysicsManager(this.map);
        this.callbacks = opts.callbacks;
        this.gameLoop = null;
    }

    update(){
        this.render.clear();

        if (this.controls.action.left) {
            this.player.moveLeft();
        }

        if (this.controls.action.right) {
            this.player.moveRight();
        }

        if (this.controls.action.up) {
            this.player.moveUp();
        }

        if (this.controls.action.down) {
            this.player.moveDown();
        }

        if (this.controls.action.shoot) {
            this.player.shoot(this.pBullets, eventsManager.mouseCoords);
            this.controls.action.shoot = false;
        }

        this.physics.updateUnit(this.player);
        this.render.draw(this.player);

        this.physics.updateBullets(this.pBullets);
        this.render.draw(this.pBullets);
        this.render.draw(this.enemies);
        // this.eBullets.forEach(b => {
        //     this.physics.update(b);
        //     this.render.draw(b);
        // });
    };

    run(){
        for (let x = this.map.width / 4; x <= 3 * this.map.width / 4; x += this.map.width / 4) {
            const e = new Unit(
                new Vec(x, this.map.height / 5),
                new Vec(0, 0),
                25,
                25,
            );
            e.fill = "red";
            this.enemies.push(e);
        }

        this.gameLoop = setInterval(() => this.update(), 30);
    }
}
