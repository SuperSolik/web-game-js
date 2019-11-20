import {Vec} from "./entities";

export class EventsManager {
    constructor(canvas) {
        this.rect = canvas.getBoundingClientRect();

        document.addEventListener("keydown", (e) => this.onKeyDown(e));
        document.addEventListener("keyup", (e) => this.onKeyUp(e));
        canvas.addEventListener("mousedown", (e) => this.getMousePos(e));

        this.action = {
            left: false,
            right: false,
            shoot: false,
            up: false,
            down: false
        };

        this.bind = {
            KeyA: 'left',
            KeyD: 'right',
            KeyW: 'up',
            KeyS: 'down',
        };

        this.mouseCoords = new Vec(0, 0);
    }

    onKeyDown(event) {
        let action = this.bind[event.code];
        if (action) {
            this.action[action] = true;
            event.preventDefault();
        }
    }

    onKeyUp(event) {
        let action = this.bind[event.code];
        if (action) {
            this.action[action] = false;
            event.preventDefault();
        }
    }

    getMousePos(event) {
        this.mouseCoords = new Vec(event.clientX - this.rect.left, event.clientY - this.rect.top);
        this.action["shoot"] = true;
    }
}
