exports.getGames = function(year, week) {
  var games = require.main.require('./data/Week' + week + '_games.json');
  return games;
};

exports.getGameForTeam = function(year, week, team) {
  var games = require.main.require('./data/Week' + week + '_games.json');
  var matchingGame = null;
  games.forEach(game => {
      if (game.home == team || game.away == team) {
          matchingGame = game;
      }
  });
  return matchingGame;
};