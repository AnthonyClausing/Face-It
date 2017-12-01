const Sequelize = require('sequelize')
const db = require('../db')

const Game = db.define('game', {
    winner : {
        type : Sequelize.STRING
    },
    player1Score:{
        type: Sequelize.INTEGER
    },
    player2Score:{
        type: Sequelize.INTEGER
    }
})

module.exports = Game;