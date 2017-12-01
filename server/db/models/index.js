const User = require('./user');
const Game = require('./game');

User.belongsToMany(User,{as: 'Friends', through: 'friends', constraints:false});
Game.belongsToMany(User,{as: 'Players' ,through: 'UserGames'});
User.belongsToMany(Game,{as: 'Games', through: 'UserGames'});
module.exports = { User, Game }