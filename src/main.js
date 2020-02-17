import {GameManager} from "./gameManager";

let game = null;

document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");

	const restartBtnScreen = document.querySelector(".gameover");
	const restartBtn = document.querySelector(".gameover button");

	function start() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		game = new GameManager({
			ctx: ctx,
			canvas: canvas,
			callbacks: {
				updateScore: (score) => console.log(`NEW SCORE IS ${score}`),
				gameOver: () => {
					console.log("GAME OVER");
					restartBtnScreen.classList.add("show");
				}
			}
		});
		game.run();
	}

	function gameOver(score, end = false) {
		restartBtnScreen.classList.add("show");
	}

	restartBtn.addEventListener("click", () => {
		restartBtnScreen.classList.remove("show");
			game = null;
			start();
	});

	start();
});



