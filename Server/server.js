"use strict";

let Game = require("./models/game.js");
let GameList = require("./models/gameList.js");

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = low(adapter);

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());
app.use(express.static('media'));

const http = require('http').Server(app);
const server = app.listen(process.env.PORT || 8080);
let io = require('socket.io').listen(server);


let gameList = new GameList;

/**
 * Partie API
 */

app.get('/getAllScenarios', function(req, res){

    const scenarios = db
        .get('scenarios')
        .write();

    res.status(200).send({
        passed: true,
        scenarios: scenarios
    });
});

app.get('/addGame/:name/:user', function(req, res){

    const gameName = req.params.name.toLowerCase();
    const userName = req.params.user;

    if(!gameList.hasGameNamed(gameName)){

        let game = new Game(gameList.getLastIndex(),gameName);

        game.setChief(userName);
        gameList.push(game);

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
    const gameName = req.params.name.toLowerCase();
    if(gameList.hasGameNamed(gameName)){
        res.send({
            passed: true,
            game: gameList.get(gameName)
        });
    }
    else {
        res.status(404).send({
            message: "Partie introuvable"
        })
    }
    
});

app.get('/getInventory/:game', function(req, res){

    const gameName = req.params.game.toLowerCase();
    if(gameList.hasGameNamed(gameName)){
        res.send({
            passed: true,
            inventory: gameList.get(gameName)["inventory"]
        });
    }
    else {
        res.status(404).send({
            message: "Partie introuvable"
        })
    }

});

app.get('/addItem/:game/:item', function(req, res){

    const gameName = req.params.game.toLowerCase();
    if(gameList.hasGameNamed(gameName)){
        const currentGame = gameList.get(gameName);

        if(currentGame.isRunning()) {
            currentGame.getInventory().push({name: req.params.item.valueOf(), pathImg: "assets/imgs/items/"+ req.params.item.valueOf() +".jpg", quantity: 1});
            res.send({
                passed: true,
                game: currentGame,
                inventory: currentGame.inventory
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

    const gameName = req.params.gameName.toLowerCase();
    if(gameList.hasGameNamed(gameName)){
        const currentGame = gameList.get(gameName);

        currentGame.indications.push({message: req.params.indication});
        res.send({
            passed: true,
            game: currentGame
        });
    }
    else {
        res.status(404).send({
            message: "Partie introuvable"
        })
    }

});


app.get('/getIndications/:gameName', function(req, res){

    const gameName = req.params.gameName.toLowerCase();
    if(gameList.hasGameNamed(gameName)){
        const currentGame = gameList.get(gameName);

        res.send({
            passed: true,
            indications: currentGame["indications"]
        });
    }
    else {
        res.status(404).send({
            message: "Partie introuvable"
        })
    }

});

app.get('/getSkills/:gameName', function(req, res){

    const gameName = req.params.gameName.toLowerCase();
    if(gameList.hasGameNamed(gameName)){
        const currentGame = gameList.get(gameName);

        res.send({
            passed: true,
            skills: currentGame["scenario"]["skills"]
        });
    }
    else {
        res.status(404).send({
            message: "Partie introuvable"
        })
    }

});



/**
 * Partie Sockets
 */

io.on('connection', function(client) {

    client.on('createGame', function(data) {
        let currentGame = gameList.get(data.game.toLowerCase());
        client.join(currentGame.getName());

        console.log("Partie "+data.game+" créee");
    });

    client.on('startGame', function(data) {

        let currentGame = gameList.get(data.game.toLowerCase());
        let currentUser = data.user;

        if(currentGame.isRunnableBy(currentUser)) {

            currentGame.mapPlayersToMissions();
            currentGame.run();

            io.to(currentGame.getName()).emit('game_start', {game: currentGame});
            setTimeout(timeOver, (currentGame.getTimeInMinuts()*60+2)*1000, currentGame.getName());
            setTimeout(timeHalf, ((currentGame.getTimeInMinuts()*60+2)*1000)/2, currentGame.getName());

            console.log("Partie "+data.game+" demarrée");
        }

    });



    client.on('joinGame', function(data) {

        console.log(data.user+" tente de rejoindre la partie "+data.game);

        let currentGame = gameList.get(data.game.toLowerCase());

        if(currentGame.hasPlayerNamed(data.user)){
            client.emit('notification', {message:'Ce nom existe déjà. Veuillez en choisir un autre'});
        }

        else if(currentGame.acceptsPlayerNamed(data.user)){
            currentGame.addPlayer(data.user);

            client.join(currentGame.getName());
            client.emit('join_success', {game: currentGame, pseudo: data.user});

            client.broadcast.to(currentGame.getName()).emit('players_changed', {players:currentGame.getPlayers()});

            console.log(data.user+" a rejoint la partie "+data.game);
        }
        else{
            client.emit('notification', {message:'La partie ne peut pas accueillir de joueurs'});
        }
    });



    client.on('addItemToInventory', function(data) {
        let currentGame = gameList.get(data.game.name.toLowerCase());

        if(currentGame.isRunning()) {
            io.to(currentGame.getName()).emit('item_added', {game: currentGame});
            client.broadcast.to(currentGame.getName()).emit('notification', {subject:"inventory", message: "Un nouvel item a été trouvé"});

            if(currentGame.inventory.length === currentGame.missions.length)
                io.to(currentGame.getName()).emit('end_of_game', {win: true, message: "Vous avez résolu toutes les missions dans le temps imparti !"});
        }
    });

    client.on('indicateClue', function(data) {
        let gameName = data["gameName"].toLowerCase();

        if(gameList.hasGameNamed(gameName)){
            const currentGame = gameList.get(gameName);

            currentGame.indications.push(data["location"]);

            io.to(currentGame.getName()).emit('indication_added', {markers: currentGame.indications});

            client.broadcast.to(currentGame.getName()).emit('notification', {subject:"map", message:"Votre équipe a ajouté une identification à la carte"});
            client.emit('notification', {message:"L'indentification a bien été partagée"});
        }


    });


    client.on('quitGame', function(data) {
        let currentGame = gameList.get(data.game.toLowerCase());
        let gameRoom = currentGame.getName();

        if (currentGame.isWaitingForPlayers()){
            currentGame.removePlayer(data.user);
            client.leave(gameRoom);
            client.broadcast.to(gameRoom).emit('players_changed', {players: currentGame.players});
        }
        else if(currentGame.isRunning()){
            io.to(currentGame.getName()).emit('end_of_game', {win: false, message:"Un joueur a quitté la partie !"});
            destroyGame(currentGame.getName());
        }

    });


    client.on('pickScenario', function (data) {
        let currentGame = gameList.get(data.game.toLowerCase());

        const selectedScenario = db
            .get('scenarios')
            .find({ id: data.id })
            .value();

        currentGame.setScenario(selectedScenario);
        io.to(currentGame.getName()).emit('scenario_pick', {id: data.id , game: currentGame});
    });

    function timeHalf(gameName){
        io.to(gameName).emit('notification', {subject:"time", message:"Vous êtes à la moitié du temps imparti !"});
    }

    function timeOver(gameName){
        io.to(gameName).emit('end_of_game', {win: false, message:"Vous n'avez pas rempli toutes les missions dans le temps imparti !"});
        destroyGame(gameName);
    }

    function destroyGame(gameName){

        if(gameList.hasGameNamed(gameName)){
            gameList.pop(gameName);

            io.of('/').in(gameName).clients(function(error, clients) {
                if (clients.length > 0) {
                    clients.forEach(function(socket_id) {
                        io.sockets.sockets[socket_id].leave(gameName);
                    });
                }
            });
        }
    }

    client.on('help_request', function (data) {
        let currentGame = gameList.get(data.game.toLowerCase());
        let enigm = data.enigm;

        client.broadcast.to(currentGame.getName()).emit('help_request', {enigm: enigm});
        console.log("Help request transmitted")
    });

    client.on('help_request_empty', function (data) {
        let currentGame = gameList.get(data.game.toLowerCase());
        let user = data.user;
        console.log(user+" n'a rien suggéré");
    });

    client.on('help_request_response', function (data) {
        let currentGame = gameList.get(data.game.toLowerCase());
        let user = data.user;
        let answer = data.answer

        console.log(user+" a suggéré "+answer);
    });
});