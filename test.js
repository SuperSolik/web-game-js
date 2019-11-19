// If all goes well prints JSON to stdout

const fs = require('fs');
const readline = require('readline');
const p = "/home/supersolik/Workspace/Code/Web/WebstormProjects/web-game-joust/sprites/tiles_list";

let data = {};
const rl = readline.createInterface({
    input: fs.createReadStream(p),
    output: process.stdout,
    terminal: false,
});
rl
    .on('line', (line) => {
        let m = line.match(/([a-z0-9_]+) +([0-9]+) +([0-9]+) +([0-9]+) +([0-9]+) ?([0-9]?)/);
        if (m) {
            data[m[1]] = {
                x: parseInt(m[2]),
                y: parseInt(m[3]),
                w: parseInt(m[4]),
                h: parseInt(m[5]),
                animLen: parseInt(m[6] || 1),
                isAnim: !!m[6],
            };
        }
    })
    .on('close', () => {
        // console.log(JSON.stringify(data, null, 4));
        fs.writeFileSync("../data/entities.json", JSON.stringify(data, null, 2));
    });
