import {Enemy, Player, Vec} from "./entities";

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

        this.player.fill = "green";

        this.enemies = [];
        this.bullets = [];
        this.killLater = [];

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
            this.player.shoot(this.bullets, eventsManager.mouseCoords);
            this.controls.action.shoot = false;
            console.log(this.bullets.map(b => b.destroy));
        }

        this.enemies.forEach(e => {
            if (e.shooting) {
                e.shoot(this.bullets, this.player.pos);
                setTimeout(() => {
                    e.shooting = true;
                }, 1000);
            }
        });

        this.physics.update(this.player, this.enemies, this.bullets);
        if (this.player.destroy) {
            this.player = null;
            console.log("GAME OVER");
            clearInterval(this.gameLoop);
            return;
        }

        for (let index in this.enemies) {
            if (this.enemies[index].destroy) {
                this.enemies.splice(index, 1);
            }
        }

        for (let index in this.bullets) {
            if (this.bullets[index].destroy) {
                this.bullets.splice(index, 1);
            }
        }
        this.render.draw(this.player);
        this.render.draw(this.enemies);
        this.render.draw(this.bullets);
    };

    run(){
        for (let x = this.map.width / 4; x <= 3 * this.map.width / 4; x += this.map.width / 4) {
            const e = new Enemy(
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
