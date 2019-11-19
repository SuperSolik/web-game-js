// import {Enemy, Player, Vec} from "./entities";
// import {EventsManager} from "./eventsManager";
//
// const {eventsManager} = require("./eventsManager");
// const {SpritesManager} = require("./spritesManager");
// const {PhysicsManager} = require("./physicsManager");
// const {MapManager} = require("./mapManager");

// export class GameManager {
class GameManager {
    constructor(opts) {
        this.actors = [];
        this.player = null;

        this.controls = new EventsManager(opts.canvas.getBoundingClientRect());
        this.render = new SpritesManager(opts.ctx);
        this.map = new MapManager();
        this.physics = new PhysicsManager(this.map);
        this.callbacks = opts.callbacks;
        this.gameLoop = null;
        this.score = 0;
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
            this.player.shoot(this.actors, this.controls.mouseCoords);
            this.controls.action.shoot = false;
        }

        this.actors.forEach(e => {
            if (e.shooting) {
                e.shoot(this.actors, this.player.pos);
                setTimeout(() => {
                    e.shooting = true;
                }, Math.random() * 2500);
            }
        });

        this.physics.update(this.actors);

        if (this.player.destroy) {
            this.player = null;
            console.log("GAME OVER");
            clearInterval(this.gameLoop);
            this.callbacks.gameOver(this.score);
            return;
        }

        for (let index in this.actors) {
            if (this.actors[index].destroy) {
                if (this.actors[index] instanceof Enemy) {
                    this.score += 10;
                    this.callbacks.updateScore(this.score);
                }
                this.actors.splice(index, 1);
            }
        }

        this.render.drawMapBottom(this.map);
        this.render.draw(this.actors);
        this.render.drawMapTop(this.map);
    };

    run(){
        this.map.loadLevel(this.actors);
        this.render.init().then(() => {
            this.player = this.actors[0];
            this.gameLoop = setInterval(() => this.update(), 35);
        })
    }
}
