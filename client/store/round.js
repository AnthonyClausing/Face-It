//Initial State
const initialState = {
  rounds : 0 
}

//ACTIONS
const SET_ROUNDS = 'SET_ROUNDS';
const DECREMENT_ROUNDS = "DECREMENT ROUNDS";
const CHECK_ROUND = "CHECK_ROUND";

//ACTION CREATORS
export function setRounds(num){
  return {type: SET_ROUNDS, rounds: num}
}

export function decrementRound(){
  return {type: DECREMENT_ROUNDS}
}

export function checkRound(){
  return {type: CHECK_ROUND}
}

//Reducer

const reducer = function(state = initialState, action){
    switch(action.type){
      case SET_ROUNDS:
        return Object.assign({}, state, {rounds : action.rounds});
      case DECREMENT_ROUNDS:
        return Object.assign({}, state, {rounds: rounds--});
      case CHECK_ROUND:
        return state.rounds
      default:
        return state;
    }
}

export default reducer
