const User = require('./user');
//const Friends =require('./friends');

User.belongsToMany(User,{as: 'Friends', through: 'friends', constraints:false});
// User.belongsToMany(User,{as: 'Frienders', through: 'friends', foreignKey:'userId', constraints:false});



module.exports = { User }