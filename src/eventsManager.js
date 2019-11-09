let eventsManager = {
        action: {
            left: false,
            right: false,
            fly: false,
            up: false,
            down: false
        },

        bind: {
            KeyA: 'left',
            KeyD: 'right',
            KeyW: 'up',
            KeyS: 'down',
            Space: 'fly'
        },

    onKeyDown: (event) => {
        let action = eventsManager.bind[event.code];
        if(action)
            eventsManager.action[action] = true;
    },

    onKeyUp: (event) => {
        let action = eventsManager.bind[event.code];
        if(action)
            eventsManager.action[action] = false;
    }
};
