const db = require('./db')

// register models
require('./models/user')
require('./models/game')

module.exports = db

