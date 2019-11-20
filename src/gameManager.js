import {Enemy} from "./entities";
import {EventsManager} from "./eventsManager";
import {SpritesManager} from "./spritesManager";
import {PhysicsManager} from "./physicsManager";
import {MapManager} from "./mapManager";

export class GameManager {
	constructor(opts) {
		this.actors = [];
		this.player = null;

		this.controls = new EventsManager(opts.canvas);
		this.render = new SpritesManager(opts.ctx);
		this.map = new MapManager();
		this.physics = new PhysicsManager(this.map);
		this.callbacks = opts.callbacks;
		this.gameLoop = null;
		this.score = 0;
		this.enemiesCount = 0;
	}

	update() {
		if (this.physics.isTouchExit && this.enemiesCount <= 0) {
			if (this.map.levelNum >= 2) {
				this.callbacks.gameOver(this.score, true);
				clearInterval(this.gameLoop);
				return;
			}
			clearInterval(this.gameLoop);
			this.run();
		}

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
			clearInterval(this.gameLoop);
			this.callbacks.gameOver(this.score);
			return;
		}

		for (let index in this.actors) {
			if (this.actors[index].destroy) {
				if (this.actors[index] instanceof Enemy) {
					this.score += 10;
					this.enemiesCount--;
					this.callbacks.updateScore(this.score);
				}
				this.actors.splice(index, 1);
			}
		}

		this.render.drawMapBottom(this.map);
		this.render.draw(this.actors);
		this.render.drawMapTop(this.map);
	};

	run() {
		this.player = null;
		this.actors = [];
		this.map.loadLevel(this.actors);
		this.render.init().then(() => {
			this.player = this.actors[0];
			this.enemiesCount = this.actors.filter(o => o instanceof Enemy).length;
			this.gameLoop = setInterval(() => this.update(), 35);
		});
	}
}
