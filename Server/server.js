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

var games = [];
var scenarios = [];
var items = ["arduino", "programmeC", "capteursArduino"];

var scenario1 = {
    name:"Invasion de zombies",
    nbGamers:3,
    timeInMinuts:30,
    summary:"SophiaTech a été envahi par des hordes de zombies, pour vous en sortir vivant et " +
    "trouver une issue, vous devez envoyer un petit robot d’exploration.",
    missions:[{message:"Trouver un Arduino",item:0}, {message:"Trouver le programme C",item:1}, {message:"Trouver des capteurs",item:2}]
};

scenarios.push(scenario1);


app.get('/getScenarios', function(req, res){
    res.send({
        passed: true,
        scenarios: scenarios
    });
});

app.get('/getScenario/:id', function(req, res){
    var scenarioId = req.params.id;
    if(scenarioId < scenarios.length){
        res.send({
            passed: true,
            scenario: scenarios[scenarioId]
        });
    }
    else{
        res.status(404).send({
            message: "Scenario introuvable"
        })
    }
});

app.get('/addGame/:name', function(req, res){
    var gamersArr = [];
    gamersArr.push(req.connection.remoteAddress);
    var game = {name : req.params.name.toLowerCase(),gamers:gamersArr};
    games.push(game);
    res.send({
        passed: true,
        message: 'Partie ajoutée'
    });
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

app.listen(process.env.PORT || 8080);