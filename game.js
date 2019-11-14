document.addEventListener('DOMContentLoaded', (event) => {
    const {GameManager} = require("./src/gameManager");

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    // ctx.transform(1, 0, 0, -1, 0, canvas.height);

    const game = new GameManager({
        ctx: ctx,
        canvas: canvas,
        callbacks: null
    });

    document.addEventListener("keydown", game.controls.onKeyDown);
    document.addEventListener("keyup", game.controls.onKeyUp);
    document.addEventListener("mousedown", (e) => game.controls.getMousePos(canvas, e));

    game.run();
});


