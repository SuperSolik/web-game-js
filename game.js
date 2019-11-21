import {GameManager} from "./src/gameManager";

let game;

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");
    const loginBtn  = document.querySelector(".header button");
    const screen = document.querySelector(".gameover");
    const restartBtn = document.querySelector(".gameover button");

    const sounds = {};

    document.querySelectorAll('audio').forEach(audio => {
       sounds[audio.id] = audio;
    });

    console.log(sounds);

    function updateScore(score) {
        scoreElement.innerText = score;
        if (!localStorage.hasOwnProperty('scoreTable')) {
            localStorage.setItem('scoreTable', '{}');
        }

        const table = JSON.parse(localStorage.getItem('scoreTable'));
        table[localStorage.username] = score;
        localStorage.setItem('scoreTable', JSON.stringify(table));
    }

    function onRestart() {
        screen.classList.remove("show");
        start();
    }
        
    function start() {
        game = new GameManager({
            ctx: ctx,
            canvas: canvas,
            callbacks: {
                updateScore: updateScore,
                gameOver: gameOver
            }
        });
        game.run();
    }
    
    function onLogin() {
        let username = prompt("Input username");
        localStorage.username = username;

        start();
    }

    function gameOver(score, end = false) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const title = document.querySelector(".gameover h1");

        if (end) {
            title.innerText = "End of the road";
        } else {
            title.innerText = "You died...";
        }

        const tableBody = document.querySelector('#score-table tbody');
        tableBody.innerHTML = "";
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

    loginBtn.addEventListener("click", onLogin);
    restartBtn.addEventListener("click", onRestart);


});



