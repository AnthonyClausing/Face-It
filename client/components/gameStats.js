import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getGameStats} from '../store';

class GameStats extends Component{
  constructor(props){
    super()
  }

componentDidMount(){
  this.props.getGamesList()
}


render(){
  return(
    <div  id="game-stats">
      <table className="game-stats-table">
        <thead>
          <tr id="table-header">
            <th>Win/Loss</th>
            <th id="winner-name">Winner</th>
            <th id="player1-points"> Player1 Points</th>
            <th id="player2-points">Player2 Points</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.games && this.props.games.map(game =>{
           return( 
             <tr key={game.id}>
             <td>             {game.winner === this.props.username ? "Win" : "Loss"  } </td>
             <td>             {game.winner}</td>
             <td>             {game.player1Score}</td>
             <td>             {game.player2Score}</td>
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
    getGamesList() {
      return dispatch(getGameStats())
    }
  }
}
export default connect(mapState,mapDispatch)(GameStats)