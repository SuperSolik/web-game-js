export class MapManager {
    constructor(){
        const map = require("../data/map");
        this.width = map.width;
        this.height = map.height;
        this.levels = map.levels;
        this.levelNum = -1;
        console.log(this.levels);
        this.curLevel = null;
    }

    nextLevel() {
        this.levelNum = (this.levelNum + 1) % this.levels.length;
        this.curLevel = this.levels[this.levelNum];
    }
}
