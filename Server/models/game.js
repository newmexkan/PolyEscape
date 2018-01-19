/**
 * Created by Julien on 14/01/2018.
 */
"use strict";
let Player = require("./player.js");

const GameState = {
    WAITING_SCENARIO: Symbol("En attente d'un scénario"),
    WAITING_PLAYERS: Symbol("En attente de joueurs"),
    RUNNING: Symbol("En cours"),
    FINISHED: Symbol("Terminée")
};

module.exports = class Game {

    constructor(id, name) {
        this.id = id;
        this.name = name.toLowerCase();
        this.chief;
        this.state = GameState.WAITING_SCENARIO;
        this.players = [];
        this.scenario;
        this.inventory = [];
        this.missions = [];
        this.indications = [];
    }

    getName() {
        return this.name;
    }

    addPlayer(play){
        this.players.push(play);
    }

    acceptsPlayerNamed(name){
        return (this.state === GameState.WAITING_PLAYERS && (this.players.length <= this.scenario["nbPlayers"]) && !this.hasPlayerNamed(name));
    }

    getScenario(){
        return this.scenario;
    }

    removePlayer(play){
        let index = this.players.findIndex(i => i.toLowerCase() === play.toLowerCase());
        this.players.splice(index, 1);
    }

    mapPlayersToMissions(){
        let nbMissions = this.scenario["missions"].length;
        let nbPlayers = this.players.length;

        if(nbMissions === nbPlayers){
            for(let i=0; i< nbPlayers;i++)
                this.missions.push({mission:this.scenario["missions"][i], player:this.players[i]});

        }
    }


    hasPlayerNamed(name){
        return (this.players.findIndex(i => i.toLowerCase() === name.toLowerCase()) != -1);
    }

    getTimeInMinuts(){
        return this.scenario.timeInMinuts;
    }

    isRunnableBy(name){
        return (name === this.chief);
    }

    setScenario(scenar){
        this.scenario = scenar;
        this.state = GameState.WAITING_PLAYERS;
    }

    setChief(ch){
        this.addPlayer(ch);
        this.chief = ch;
    }

    getChief() {
        return this.chief;
    }

    getPlayers(){
        return this.players;
    }

    getInventory(){
        return this.inventory;
    }

    run(){
        this.state = GameState.RUNNING;
    }

    isRunning(){
        return (this.state === GameState.RUNNING);
    }

    isWaitingForPlayers(){
        return (this.state === GameState.WAITING_PLAYERS);
    }

    finish(){
        this.state = GameState.FINISHED;
    }
};
