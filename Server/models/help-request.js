"use strict";

module.exports = class HelpRequest{


    constructor(client, enigme, players) {
        this.nbAnswers = 0;
        this.client = client;
        this.enigm = enigme;
        this.nbPlayers = players;
        this.answers = [];
    }

    everyoneAnswered(){
        if(this.nbAnswers === this.nbPlayers)return true;
        else return false;
    }

    addAnswer(answer){
        this.answers[this.nbAnswers] = answer;
        this.nbAnswers++;
    }

}