export class MapManager {
    constructor(){
        const map = require("../data/map");
        this.width = map.width;
        this.height = map.height;
        this.levels = map.levels;
        this.levelNum = -1;
        this.curLevel = null;
    }
}
