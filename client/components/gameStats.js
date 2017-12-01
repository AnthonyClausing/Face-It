import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getGameStats} from '../store';

class GameStats extends Component{
  constructor(props){
    super()
  }

ComponentDidMount(){
  this.props.getGames()
}


render(){
  return(
    <div id="game-stats-table">
      <table>
        <thead>
          <tr>
            <th>Winner</th>
            <th>Player1 Points</th>
            <th>Player2 Points</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.games && this.props.games.map(game =>{
           return( 
             <tr key={game.id}>
             <td>{game.winner}</td>
             <td>{game.player1score}</td>
             <td>{game.player2score}</td>
             </tr>
          )})
          }
        </tbody>
      </table>
    </div>
  )
}
}

const mapState = (state) => {
  return {
    games: state.games,
    username: state.user.userName
  }
}

const mapDispatch = (dispatch) => {
  return {
    getGames(){
      getGameStats();
    }
  }
}