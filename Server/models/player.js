/**
 * Created by Julien on 14/01/2018.
 */
"use strict";

module.exports = class Player {

    constructor(name) {
        this.name = name;
        this.missionId;
        this.skill = "None"
    }
    getName() {
        return this.name;
    }

    getMissionId(){
        return this.missionId;
    }

    setSkill(skill){
        this.skill = skill;
    }

    resetSkill(){
        this.skill = "None";
    }
}
