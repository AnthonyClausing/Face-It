const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development';
const config = require('../../config.json')[env];

if (config.use_env_variable) {
  // the application is executed on Heroku ... use the postgres database
  db = new Sequelize(process.env[config.use_env_variable])
} else {
  db =  new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: false
    }
  )
}

module.exports = db