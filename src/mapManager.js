export class MapManager {
    constructor(){
        this.mapData = null;
        this.xCount = 0;
        this.yCount = 0;
        this.tSize = {x: 32, y: 32};
        this.mapSize = {x: 32, y: 32};
        this.tilesets = [];
        this.imgLoadCount = 0;
        this.imgLoaded = false;
        this.jsonLoaded = false;

        this.width = 960;
        this.height = 768;

        this.topLayer = null;
        this.middleLayer = null;
        this.bottomLayer = null;
        this.objects = [];

        //TODO: parse objects
    }

    loadLevel() {
        fetch(`data/level1.json`)
            .then(res => res.json())
            .then(res => {
                this.parseMap(res);
            });
    }

    parseMap(tilesJSON) {
        this.mapData = tilesJSON;
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;
        for (let i = 0; i < this.mapData.tilesets.length; i++) {
            let img = new Image();
            img.onload = () => {
                this.imgLoadCount++;
                if (this.imgLoadCount === this.mapData.tilesets.length) {
                    this.imgLoaded = true;
                }
            };
            img.src = "web-game-joust/" + this.mapData.tilesets[i].image;
            let t = this.mapData.tilesets[i];
            let ts = {
                firstgid: t.firstgid, image: img, name: t.name, xCount: Math.floor(t.imagewidth / this.tSize.x),
                yCount: Math.floor(t.imageheight / this.tSize.y)
            };
            this.tilesets.push(ts);
        }
        this.topLayer = this.mapData.layers.find(l => l.name === "top");
        this.middleLayer = this.mapData.layers.find(l => l.name === "middle");
        this.bottomLayer = this.mapData.layers.find(l => l.name === "bottom");

        this.jsonLoaded = true;
    }

    isWall(x, y) {
        let wX = Math.floor(x / 2);
        let wY = Math.floor(y / 2);
        let idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);
        let tileId = this.middleLayer.data[idx];
        const wallId = [34, 257, 258, 199, 101, 37, 597, 291, 292, 259, 260, 483, 484];
        return wallId.find(id => id === tileId);
    }

    getTile(tileIndex) {
        let tile = {
            img: null, px: 0, py: 0
        };
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgid;
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);
        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;
        return tile;
    }

    getTileset(tileIndex) {
        for (let i = this.tilesets.length - 1; i >= 0; i--)
            if (this.tilesets[i].firstgid <= tileIndex) {
                return this.tilesets[i];
            }
        return null;
    }
}
