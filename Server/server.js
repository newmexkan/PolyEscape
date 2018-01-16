
"use strict";

let Player = require("./models/player.js");
let Game = require("./models/game.js");
let Scenario = require("./models/scenario.js");
let Item = require("./models/item.js");

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
var questions =[{question:"De quelle origine nous vient le sauna ?",reponses:["Des indiens","Des australiens","Des finlandais"],reponse:"Des finlandais"},
    {question:"Quel est le plus long fleuve français ?",reponses:["La Loire","La Seine","La Garonne"],reponse:"La Loire"},
    {question:"Quelle est l'altitude en mètre du mont Everest ?",reponses:["6 848","8 848","10 848"],reponse:"8 848"},
    {question:"De combien d'états sont composés Les États-Unis ?",reponses:["46","48","50"],reponse:"50"},
    {question:"Quel est le plus grand pays du monde ?",reponses:["La Chine","La Russie","L'Australie"],reponse:"La Russie"},
    {question:"Quel vent violent souffle souvent sur la côte du Sud de la France ?",reponses:["Le sirocco","La bora","Le mistral"],reponse:"Le mistral"}]
;

var scenario1 = {
    id: 1,
    name:"Invasion de zombies",
    nbPlayers:3,
    timeInMinuts:1,
    summary:"SophiaTech a été envahi par des hordes de zombies, pour vous en sortir vivant et " +
    "trouver une issue, vous devez envoyer un petit robot d’exploration.",
    missions:[{message:"Trouver un Arduino",item:0,indice:"La dernière fois qu'une carte Arduino a été utilisé c'était dans la salle d'IHM ou dans l'Ubiquarium."},
        {message:"Trouver le programme C",item:1,indice:"Les cours de C++ ont généralement lieux dans l'amphi E+131 et les TDs en E+10?."},
        {message:"Trouver des capteurs",item:2,indice:"Les capteurs sont souvent utilisés dans l'Ubiquarium ou les salles E+10?."}],
    questions:questions
};


var scenario2 = {
    id: 2,
    name:"Prise de la Bastille",
    nbPlayers:3,
    timeInMinuts:30,
    summary:"SophiaTech a été envahi par des hordes de zombies, pour vous en sortir vivant et " +
    "trouver une issue, vous devez envoyer un petit robot d’exploration.",
    missions:[{message:"Trouver un Arduino",item:0,indice:"La dernière fois qu'une carte Arduino a été utilisé c'était dans la salle d'IHM ou dans l'Ubiquarium."},
        {message:"Trouver le programme C",item:1,indice:"Les cours de C++ ont généralement lieux dans l'amphi E+131 et les TDs en E+10?."},
        {message:"Trouver des capteurs",item:2,indice:"Les capteurs sont souvent utilisés dans l'Ubiquarium ou les salles E+10?."}],
    questions:questions
};

var scenario3 = {
    id: 3,
    name:"Redoublement de Pierre",
    nbPlayers:1,
    timeInMinuts:60,
    summary:"Pierre s'est trop touché la nouille au premier semestre " +
    "du coup il est dans la merde. il a besoin de toi",
    missions:[{message:"Aider Pierre en Algo & Comp",item:0}, {message:"Aider Pierre en COO",item:1}, {message:"Aider Pierre en Sécu Log",item:2}]
};


scenarios.push(scenario1);
scenarios.push(scenario2);
scenarios.push(scenario3);

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
        console.log("Partie "+gameName+ " crée")
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

app.get('/getInventory/:game', function(req, res){
    console.log(req.params);
    console.log(req.params.game);
    var gameId = games.findIndex(i => i.getName() === req.params.game.toLowerCase());
    if(gameId != -1){
        res.send({
            passed: true,
            inventory: games[gameId].inventory
        });
    }
    else {
        res.status(404).send({
            message: "Partie introuvable"
        })
    }

});

app.get('/addItem/:game/:item', function(req, res){

    var gameId = games.findIndex(i => i.getName() === req.params.game.toLowerCase());
    if(gameId != -1){
        var currentGame = games[gameId];

        if(currentGame.isRunning()) {
            currentGame.getInventory().push({name: req.params.item, pathImg: "assets/imgs/wood.png", quantity: 1});
            console.log(games[gameId].getInventory());
            res.send({
                passed: true,
                game: games[gameId],
                inventory: games[gameId].getInventory()
            });
        }
        else {
            res.send({
                message: "Partie non-accessible (terminée ou non commencée)"
            })
        }
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
        //console.log(data.user+" a rejoint la partie "+data.game+" en tant que chef");
        //console.log("Joueurs de la partie :\n"+currentGame.getPlayers());

    });

    client.on('startGame', function(data) {

        let currentGame = games[games.findIndex(i => i.getName() === data.game.toLowerCase())];
        let currentUser = data.user;

        if(currentGame.hasAsChief(currentUser)) {

            currentGame.mapPlayersToMissions();

            io.to(currentGame.getName()).emit('game_start', {game: currentGame});

            setTimeout(timeOver, (currentGame.getTimeInMinuts()*60+2)*1000, currentGame);

            // log serveur
            //console.log(data.user + " a lancé la partie " + currentGame.getName());
        }

    });



    client.on('joinGame', function(data) {

        let currentGame = games[games.findIndex(i => i.getName() === data.game.toLowerCase())];


        if(currentGame.acceptsPlayerNamed(data.user)){
            //rejoint la partie
            currentGame.addPlayer(data.user);

            //rejoint le channel dédié à la partie
            client.join(currentGame.getName());

            //notifie les autres joueurs de la partie
            client.broadcast.to(currentGame.getName()).emit('players_changed', {players:currentGame.getPlayers()});

            // log serveur
            //console.log(data.user+" a rejoint la partie "+data.game);
            //console.log("Joueurs de la partie :\n"+currentGame.getPlayers());
        }
    });


    client.on('addItemToInventory', function(data) {

        let currentGame = games[games.findIndex(i => i.getName() === data.game.name.toLowerCase())];

        if(currentGame.isRunning()) {
            //notifie les autres joueurs de la partie
            io.to(currentGame.getName()).emit('item_added', {game: currentGame});

            // log serveur
            //console.log(data.game + " a ajouté l'item: ");
            //console.log("Inventaire :\n" + currentGame.getInventory());
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
        //console.log(data.user+" a quitté la partie "+data.game);
        //console.log("Joueurs de la partie :\n"+currentGame.players);
    });


    client.on('pickScenario', function(data) {


        let currentGame = games[games.findIndex(i => i.getName() === data.game.toLowerCase())];
        let id = data.id -1;
        //currentGame.setScenario(data.game);
        let result;
        for( result in scenarios){
            if(result.id === id){
                io.to(currentGame.getName()).emit('scenario_pick', {id: id, scenario: scenarios[id]});

            }
        }
        console.log("Scénario choisi n°"+id)

    });

    function timeOver(game){
        io.to(game.getName()).emit('end_of_game', {win: false});
        destroyGame(game.getName());
    }

    function destroyGame(gameName){

        var index = games.findIndex(i => i.getName() === gameName.toLowerCase())
        if (index > -1) {
            games.splice(index, 1);
        }

        io.of('/').in(gameName).clients(function(error, clients) {
            if (clients.length > 0) {
                clients.forEach(function(socket_id) {
                    io.sockets.sockets[socket_id].leave(gameName);
                });
            }
        });
    }
});




