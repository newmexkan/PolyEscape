
"use strict";


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
var items = ["arduino", "programmeC", "capteursArduino"];
var players = [];

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

app.get('/addGame/:name', function(req, res){

    var gameName = req.params.name.toLowerCase();

    // si une partie du même nom n'existe pas deja
    if(games.findIndex(i => i.name === gameName) === -1){
        var playersArr = [];
        var game = {name : gameName,players:playersArr};
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
    var gameId = games.findIndex(i => i.name === req.params.name.toLowerCase());
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

    client.on('joinGame', function(data) {

        var gameId = games.findIndex(i => i.name === data.game.toLowerCase());

        //
        if(games[gameId].players.indexOf(data.user) === -1){
            //rejoint la partie
            games[gameId].players.push(data.user);

            //rejoint le channel dédié à la partie
            client.join(data.game);

            //notifie les autres joueurs de la partie
            client.broadcast.to(data.game).emit('players_changed', {players:games[gameId].players});

            // log serveur
            console.log(data.user+" a rejoint la partie "+data.game);
            console.log("Joueurs de la partie :\n"+games[gameId].players);
        }
    });

    client.on('quitGame', function(data) {

        var gameId = games.findIndex(i => i.name === data.game.toLowerCase());
        var player = games[gameId].players.indexOf(data.user);

        // retire le joueur de la partie
        if (player > -1) {
            games[gameId].players.splice(player, 1);
        }

        // quitte le channel dédié a la partie
        client.leave(data.game);

        //notifie les autres joueurs de la partie
        client.broadcast.to(data.game).emit('players_changed', {players:games[gameId].players});

        // log serveur
        console.log(data.user+" a quitté la partie "+data.game);
        console.log("Joueurs de la partie :\n"+games[gameId].players);
    });
});




