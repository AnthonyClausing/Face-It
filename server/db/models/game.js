const Sequelize = require('sequelize')
const db = require('../db')

const Game = db.define('game', {
    winner : {
        type : Sequelize.INTEGER
    },
    player1Score:{
        type: Sequelize.INTEGER
    },
    player2Score:{
        type: Sequelize.INTEGER
    },
    player1:{
      type: Sequelize.INTEGER
      
    },
    player2:{
      type: Sequelize.INTEGER      
    }

    
})