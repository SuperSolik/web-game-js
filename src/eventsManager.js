import {Vec} from "./entities";

export const eventsManager = {
    action: {
        left: false,
        right: false,
        shoot: false,
        up: false,
        down: false
    },

    bind: {
        KeyA: 'left',
        KeyD: 'right',
        KeyW: 'up',
        KeyS: 'down',
    },

    mouseCoords: new Vec(0, 0),

    onKeyDown: (event) => {
        let action = eventsManager.bind[event.code];
        if (action) {
            eventsManager.action[action] = true;
            event.preventDefault();
        }
    },

    onKeyUp: (event) => {
        let action = eventsManager.bind[event.code];
        if (action) {
            eventsManager.action[action] = false;
            event.preventDefault();
        }
    },

    getMousePos: (canvas, evt) => {
        let rect = canvas.getBoundingClientRect();
        eventsManager.action["shoot"] = true;
        eventsManager.mouseCoords = new Vec(evt.clientX - rect.left, evt.clientY - rect.top);
    }
};
