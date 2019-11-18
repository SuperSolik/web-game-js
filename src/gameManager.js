import {Enemy, Player, Vec} from "./entities";

const {eventsManager} = require("./eventsManager");
const {SpritesManager} = require("./spritesManager");
const {PhysicsManager} = require("./physicsManager");
const {MapManager} = require("./mapManager");

export class GameManager {
    constructor(opts) {
        this.player = new Player(
            new Vec(opts.canvas.width / 2, opts.canvas.height / 2),
            new Vec(0, 0),
            32,
            64,
            "knight_f_run_anim");

        this.player.fill = "green";

        this.enemies = [];
        this.bullets = [];

        this.controls = eventsManager;
        this.render = new SpritesManager(opts.ctx);
        this.map = new MapManager();
        this.physics = new PhysicsManager(this.map);
        this.callbacks = opts.callbacks;
        this.gameLoop = null;
    }

    update(){
        //TODO: combine all entities to actors
        this.render.clear();
        if (this.controls.action.left) {
            this.player.moveLeft();
        } else if (this.controls.action.right) {
            this.player.moveRight();
        } else {
            this.player.stopX();
        }

        if (this.controls.action.up) {
            this.player.moveUp();
        } else if (this.controls.action.down) {
            this.player.moveDown();
        } else {
            this.player.stopY();
        }

        if (this.controls.action.shoot) {
            this.player.shoot(this.bullets, eventsManager.mouseCoords);
            this.controls.action.shoot = false;
        }

        this.enemies.forEach(e => {
            if (e.shooting) {
                e.shoot(this.bullets, this.player.pos);
                setTimeout(() => {
                    e.shooting = true;
                }, Math.random() * 2500);
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

        this.render.drawMapBottom(this.map);
        this.render.draw(this.player);
        this.render.draw(this.enemies);
        this.render.draw(this.bullets);
        this.render.drawMapTop(this.map);
    };

    run(){
        for (let x = this.map.width / 4; x <= 3 * this.map.width / 4; x += this.map.width / 4) {
            const e = new Enemy(
                new Vec(x, this.map.height / 5),
                new Vec(0, 0),
                32,
                64,
                "chort_run_anim"
            );
            this.enemies.push(e);
        }
        this.map.loadLevel();
        this.render.init().then(() => {
            this.gameLoop = setInterval(() => this.update(), 35);
        })
    }
}
