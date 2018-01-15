/**
 * Created by Julien on 14/01/2018.
 */
"use strict";

module.exports = class Player {

    constructor(name, mission) {
        this.name = name;
        this.missionId = mission;
    }
    getName() {
        return this.name;
    }

    getMissionId(){
        return this.missionId;
    }
}
