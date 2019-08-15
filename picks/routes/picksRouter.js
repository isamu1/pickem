var express = require('express');
var router = express.Router();
var picks = require('../models/picks');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Picks' });
});

/* Load week specific page for game id */
router.get('/:gameId/:year/:week', function(req, res, next) {
  var gameId = req.params["gameId"];
  var year = req.params["year"];
  var week = req.params["week"];

  var myPicks = picks.getPicks(0, year, week, 'me');
  var dadPicks = picks.getPicks(0, year, week, 'dad');
  var myScore = getScore(myPicks);
  var dadScore = getScore(dadPicks);
  res.render('picks', { year: year, week: week, playerOne: myPicks, playerTwo: dadPicks, 
    playerOneScore: myScore, playerTwoScore: dadScore });
});

var getScore = function(picks) {
  var points = 0;
  var potentialPoints = 0;
  picks.forEach(pick => {
    var underDog = false;
    var chosenScore = 0;
    var oppScore = 0;
    if (pick.chosenTeam === pick.home) {
      underDog = pick.line > 0;
      chosenScore = pick.home_score;
      oppScore = pick.away_score;
    } else {
      underDog = pick.line < 0;
      chosenScore = pick.away_score;
      oppScore = pick.home_score;
    }

    if (pick.game_over) {
      if (chosenScore > oppScore) {
        if (underDog) {
          points += 2;
        } else {
          points += 1;
        }
      }
    } else {
      if (underDog) {
        potentialPoints += 2;
      } else {
        potentialPoints += 1;
      }
    }
  });
  return { "points": points, "potential": potentialPoints };
}

module.exports = router;