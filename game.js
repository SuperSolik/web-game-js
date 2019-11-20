import {GameManager} from "./src/gameManager";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");

    function updateScore(score) {
        scoreElement.innerText = score;

        if (!localStorage.hasOwnProperty('scoreTable')) {
            localStorage.setItem('scoreTable', '{}');
        }

        const table = JSON.parse(localStorage.getItem('scoreTable'));

        table[localStorage.username] = score;

        localStorage.setItem('scoreTable', JSON.stringify(table));
    }

    function onLogin() {
        let username = prompt("Input username");
        localStorage.username = username;

        const game = new GameManager({
            ctx: ctx,
            canvas: canvas,
            callbacks: {
                updateScore: updateScore,
                gameOver: gameOver
            }
        });

        game.run();
    }

    function gameOver(score, end = false) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const screen = document.querySelector(".gameover");
        const title = document.querySelector(".gameover h1");

        if (end) {
            title.innerText = "End of the road";
        } else {
            title.innerText = "You died...";
        }

        const tableBody = document.querySelector('#score-table tbody');
        const scoreTableData = JSON.parse(localStorage.getItem('scoreTable'));


        let markup = '';
        for (let userName in scoreTableData) if (scoreTableData.hasOwnProperty(userName)) {
            markup += `
            <tr>
              <td>${userName}</td>
              <td>${scoreTableData[userName]}</td>
            </tr>
          `
        }
        tableBody.insertAdjacentHTML('beforeend', markup);
        screen.classList.add("show");
    }

    document.querySelector(".header button").addEventListener("click", onLogin);
});



