class PhysicsManager {
    constructor(mapManager){
        this.mapManager = mapManager;
    }

    updatePhysics(obj){
        if(obj.pos.x + obj.width <= 0) obj.pos.x = this.mapManager.width;
        if(obj.pos.x > this.mapManager.width) obj.pos.x = -obj.width/2;
        if(obj.pos.y <= 0) obj.pos.y = 0;
        if(obj.pos.y + obj.height >= this.mapManager.height) obj.pos.y = this.mapManager.height - obj.height;
    }

}
