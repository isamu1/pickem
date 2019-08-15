var teamObject = require.main.require('./data/teams.json');
exports.allTeams = function() {
  return teamObject;  
};