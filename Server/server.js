
"use strict";

let Player = require("./models/player.js");
let Game = require("./models/game.js");
let Scenario = require("./models/scenario.js");

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
var cors = require('cors');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());
var http = require('http').Server(app);
var server = app.listen(process.env.PORT || 8080);
var io = require('socket.io').listen(server);



var games = [];
var scenarios = [];

var scenario1 = {
    id: 1,
    name:"Invasion de zombies",
    nbPlayers:3,
    timeInMinuts:30,
    summary:"SophiaTech a été envahi par des hordes de zombies, pour vous en sortir vivant et " +
    "trouver une issue, vous devez envoyer un petit robot d’exploration.",
    missions:[{message:"Trouver un Arduino",item:0}, {message:"Trouver le programme C",item:1}, {message:"Trouver des capteurs",item:2}]
};

var scenario2 = {
    id: 2,
    name:"Prise de la Bastaille",
    nbPlayers:3,
    timeInMinuts:30,
    summary:"SophiaTech a été envahi par des hordes de zombies, pour vous en sortir vivant et " +
    "trouver une issue, vous devez envoyer un petit robot d’exploration.",
    missions:[{message:"Trouver un Arduino",item:0}, {message:"Trouver le programme C",item:1}, {message:"Trouver des capteurs",item:2}]
};


scenarios.push(scenario1);
scenarios.push(scenario2);

/**
 * Partie API
 */

app.get('/getAllScenarios', function(req, res){
    res.send({
        passed: true,
        scenarios: scenarios
    });
});

app.get('/getScenario/:id', function(req, res){
    var scenarioId = req.params.id;
    var result;
    for( result in scenarios){
        if(result.id === scenarioId){
            res.send({
                passed: true,
                scenario: scenarios[scenarioId]
            });
        }
    }
    res.status(404).send({
        message: "Scenario introuvable"
    })
});

app.get('/addGame/:name/:user', function(req, res){

    var gameName = req.params.name.toLowerCase();
    var userName = req.params.user;

    // si une partie du même nom n'existe pas deja
    if(games.findIndex(i => i.getName() === gameName.toLowerCase()) === -1){
        //var playersArr = [];
        //var game = {name : gameName,players:playersArr};
        let game = new Game(games.length,gameName);

        game.setScenario(scenario1); // TEST
        game.setChief(userName);
        games.push(game);

        res.send({
            passed: true,
            game: game
        });
        console.log("Partie "+gameName+ "crée")
    }
    else {
         res.send({
            passed: false,
            message: "Une partie existante possède le même nom !"
        });
    }
});

app.get('/getGame/:name', function(req, res){
    var gameId = games.findIndex(i => i.getName() === req.params.name.toLowerCase());
    if(gameId != -1){
        res.send({
            passed: true,
            game: games[gameId]
        });
    }
    else {
        res.status(404).send({
            message: "Partie introuvable"
        })
    }
    
});

/**
 * Partie interaction joueurs
 */
io.on('connection', function(client) {

    client.on('createGame', function(data) {

        let currentGame = games[games.findIndex(i => i.getName() === data.game.toLowerCase())];

        //rejoint le channel dédié à la partie
        client.join(currentGame.getName());

        // log serveur
        console.log(data.user+" a rejoint la partie "+data.game+" en tant que chef");
        console.log("Joueurs de la partie :\n"+currentGame.getPlayers());

    });

    client.on('startGame', function(data) {

        let currentGame = games[games.findIndex(i => i.getName() === data.game.toLowerCase())];
        let currentUser = data.user;

        if(currentGame.hasAsChief(currentUser)) {

            currentGame.mapPlayersToMissions();

            io.to(currentGame.getName()).emit('game_start', {game: currentGame});

            // log serveur
            console.log(data.user + " a lancé la partie " + currentGame.getName());
        }

    });

    client.on('joinGame', function(data) {

        let currentGame = games[games.findIndex(i => i.getName() === data.game.toLowerCase())];


        if(!currentGame.hasPlayerNamed(data.user)){
            //rejoint la partie
            currentGame.addPlayer(data.user);

            //rejoint le channel dédié à la partie
            client.join(currentGame.getName());

            //notifie les autres joueurs de la partie
            client.broadcast.to(currentGame.getName()).emit('players_changed', {players:currentGame.getPlayers()});

            // log serveur
            console.log(data.user+" a rejoint la partie "+data.game);
            console.log("Joueurs de la partie :\n"+currentGame.getPlayers());
        }
    });

    client.on('quitGame', function(data) {

        let currentGame = games[games.findIndex(i => i.getName() === data.game.toLowerCase())];

        currentGame.removePlayer(data.user);

        // quitte le channel dédié a la partie
        client.leave(data.game);

        //notifie les autres joueurs de la partie
        client.broadcast.to(data.game).emit('players_changed', {players:currentGame.players});

        // log serveur
        console.log(data.user+" a quitté la partie "+data.game);
        console.log("Joueurs de la partie :\n"+currentGame.players);
    });
});




