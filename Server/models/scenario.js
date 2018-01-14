/**
 * Created by Julien on 14/01/2018.
 */
"use strict";

class Scenario {
    _name;
    _id;
    _nbPlayers;
    _timeInMinuts;
    _summary;
    _missions = [];


    constructor(id, name, summary, nbPl, time, missions) {
        this._id = id;
        this._name = name;
        this._summary = summary;
        this._nbPlayers = nbPl;
        this._timeInMinuts = time;
        this._missions = missions;
    }
    get name() {
        return this._name;
    }

    get summary() {
        return this._summary;
    }

    get nbPlayers() {
        return this._nbPlayers;
    }

    get timeInMinuts(){
        return this._timeInMinuts;
    }
}



