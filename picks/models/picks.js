getGameForTeam = function(team, games) {
  var matchingGame = null;
  games.forEach(game => {
      if (game.home == team || game.away == team) {
          matchingGame = Object.assign({}, game);
      }
  });
  matchingGame.chosenTeam = team;
  return matchingGame;
};

exports.getPicks = function(game, year, week, player) {
  var pickedTeams = require('../data/' + year + '/Week' + week + '_picks.json');
  var games = require('../data/' + year + '/Week' + week + '_games.json');
  var picks = [];
  if(player === "me") {
     pickedTeams.me.forEach(team => {
        picks.push(getGameForTeam(team, games));
     });  
  } else if(player === "dad") {
     pickedTeams.dad.forEach(team => {
        picks.push(getGameForTeam(team, games));
     });  
  }
  return picks;
};