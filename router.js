var http = require('http');
var url = require('url');
var team = require('./models/team')
var picks = require('./models/picks')
var games = require('./models/games')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var responseString = team.allTeams().teams[0].team_id;
    responseString += "<br>My picks<br>"
    picks.getPicks(8, 'me').forEach(team => {
        responseString += "Chose: " + team + " to win => ";
        var game = games.getGameForTeam(8, team);
        if (game === null) {
            responseString += "bad stuff with team " + team;
        } else if (game.away == team) {
            responseString += game.home + " with a line of for the chosen team " + game.line;
        } else {
            responseString += game.away + " with a line of for the chosen team " + (0 - game.line);
        }
        responseString += "<br>";
    });
    responseString += "<br>Dad picks<br>"
    picks.getPicks(8, 'dad').forEach(team => {
        responseString += "Chose: " + team + " to beat => ";
        var game = games.getGameForTeam(8, team);
        if (game.away == team) {
            responseString += game.home + " with a line of for the chosen team " + game.line;
        } else {
            responseString += game.away + " with a line of for the chosen team " + (0 - game.line);
        }
        responseString += "<br>";

    });
    res.end(responseString);
}).listen(8000);