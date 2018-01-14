/**
 * Created by Julien on 14/01/2018.
 */
"use strict";

module.exports = class Scenario {

    constructor(id, name, summary, nbPl, time, missions) {
        this.id = id;
        this.name = name;
        this.summary = summary;
        this.nbPlayers = nbPl;
        this.timeInMinuts = time;
        this.missions = missions;
    }
    get name() {
        return this.name;
    }

    get summary() {
        return this.summary;
    }

    get nbPlayers() {
        return this.nbPlayers;
    }

    get timeInMinuts(){
        return this.timeInMinuts;
    }
}




