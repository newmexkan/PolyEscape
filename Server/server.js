
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
var idImg = 0;


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
    timeInMinuts:2,
    summary:"SophiaTech a été envahi par des hordes de zombies, pour vous en sortir vivant et " +
    "trouver une issue, vous devez envoyer un petit robot d’exploration.",
    missions:[{message:"Trouver un Arduino",item:0,indice:"La dernière fois qu'une carte Arduino a été utilisé c'était dans la salle d'IHM ou dans l'Ubiquarium.",img: "assets/imgs/0.jpg"},
        {message:"Trouver le programme C",item:1,indice:"Les cours de C++ ont généralement lieux dans l'amphi E+131 et les TDs en E+10?.",img: "assets/imgs/1.jpg"},
        {message:"Trouver des capteurs",item:2,indice:"Les capteurs sont souvent utilisés dans l'Ubiquarium ou les salles E+10?.",img: "assets/imgs/2.jpg"}],
    questions:questions
};


var scenario2 = {
    id: 2,
    name:"Prise de la Bastille",
    nbPlayers:3,
    timeInMinuts:30,
    summary:"SophiaTech a été envahi par des hordes de zombies, pour vous en sortir vivant et " +
    "trouver une issue, vous devez envoyer un petit robot d’exploration.",
    missions:[{message:"Trouver un Arduino",item:0,indice:"La dernière fois qu'une carte Arduino a été utilisé c'était dans la salle d'IHM ou dans l'Ubiquarium.",img: "assets/imgs/0.jpg"},
        {message:"Trouver le programme C",item:1,indice:"Les cours de C++ ont généralement lieux dans l'amphi E+131 et les TDs en E+10?.",img: "assets/imgs/1.jpg"},
        {message:"Trouver des capteurs",item:2,indice:"Les capteurs sont souvent utilisés dans l'Ubiquarium ou les salles E+10?.",img: "assets/imgs/2.jpg"}],
    questions:questions
};


scenarios.push(scenario1);
scenarios.push(scenario2);

/**
 * Partie API
 */

app.get('/getAllScenarios', function(req, res){
    res.status(200).send({
        passed: true,
        scenarios: scenarios
    });
});

app.get('/addGame/:name/:user', function(req, res){

    var gameName = req.params.name.toLowerCase();
    var userName = req.params.user;

    // si une partie du même nom n'existe pas deja
    if(games.findIndex(i => i.getName() === gameName.toLowerCase()) === -1){

        let game = new Game(games.length,gameName);

        game.setChief(userName);
        games.push(game);

        res.send({
            passed: true,
            game: game
        });
    }
    else {
         res.status(403).send({
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
            currentGame.getInventory().push({name: req.params.item.valueOf()['name'], pathImg: "assets/imgs/"+ idImg +".jpg", quantity: 1});
            idImg = (idImg +1);
            if(idImg > 2){
                idImg = 0;
            }
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

app.get('/addIndication/:gameName/:indication', function(req, res){
    var gameId = games.findIndex(i => i.getName() === req.params.gameName.toLowerCase());
    if(gameId != -1){
        var currentGame = games[gameId];
        currentGame.indications.push({message: req.params.indication});
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


app.get('/getIndications/:gameName', function(req, res){
    var gameId = games.findIndex(i => i.getName() === req.params.gameName.toLowerCase());
    if(gameId != -1){
        res.send({
            passed: true,
            indications: games[gameId].indications
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
        //console.log(data.user+" a rejoint la partie "+data.game+" en tant que chef");
        //console.log("Joueurs de la partie :\n"+currentGame.getPlayers());

    });

    client.on('startGame', function(data) {

        let currentGame = games[games.findIndex(i => i.getName() === data.game.toLowerCase())];
        let currentUser = data.user;

        if(currentGame.isRunnableBy(currentUser)) {

            currentGame.mapPlayersToMissions();
            currentGame.run();

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

            if(currentGame.inventory.length === currentGame.missions.length)
                io.to(currentGame.getName()).emit('end_of_game', {win: true});

            // log serveur
            //console.log(data.game + " a ajouté l'item: ");
            //console.log("Inventaire :\n" + currentGame.getInventory());
        }
    });

    client.on('indicateClue', function(data) {

        let currentGame = games[games.findIndex(i => i.getName() === data.game.name.toLowerCase())];

        //notifie les autres joueurs de la partie
        console.log(currentGame.inventory);
        io.to(currentGame.getName()).emit('indication_added', {game: currentGame});


        client.broadcast.to(currentGame.getName()).emit('notification', {message: "Votre équipe a ajouté une identification à la carte"});
        client.emit('notification', {message: "L'indenfication a bien été partagée"});


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


    client.on('pickScenario', function (data) {
        let currentGame = games[games.findIndex(i => i.getName() === data.game.toLowerCase())];
        let id = data.id - 1;
        currentGame.setScenario(scenarios[id]);
        io.to(currentGame.getName()).emit('scenario_pick', {id: id, game: currentGame});
        //console.log("Scénario choisi n°" + id)
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




