/**
 * Created by Julien on 14/01/2018.
 */
"use strict";

class Game {
    _name;
    _id;
    _players = [];
    _scenario;
    _chief;


    constructor(id, name, chief) {
        this._id = id;
        this._name = name;
        this._chief = chief;
    }
    get name() {
        return this._name;
    }

    addPlayer(play){
        this._players.push(play);
    }

    setScenario(scenar){
        this._scenario = scenar;
    }

    getChief() {
        return this._chief;
    }
}