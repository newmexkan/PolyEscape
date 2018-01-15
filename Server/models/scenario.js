/**
 * Created by Julien on 14/01/2018.
 */
"use strict";

module.exports = class Scenario {

    constructor(id, name, summary, nbPl, time, missions,questions) {
        this.id = id;
        this.name = name;
        this.summary = summary;
        this.nbPlayers = nbPl;
        this.timeInMinuts = time;
        this.missions = missions;
        this.questions = questions;

    }
    getName() {
        return this.name;
    }

    getSummary() {
        return this.summary;
    }

    getNbPlayers() {
        return this.nbPlayers;
    }
    getQuestions() {
        return this.questions;
    }

    getTimeInMinuts(){
        return this.timeInMinuts;
    }
}




