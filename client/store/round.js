//Initial State
const initialState = {
  rounds: 0,
  numberOfCoins: 2,
  coinPositions: [],
  gameState: null,
  targetEmotion: '',
  score: 0,
  count: 0,
  interval: '',
  emotions: ['angry', 'happy', 'sad', 'surprised']
}

//ACTIONS
const SET_ROUNDS = 'SET_ROUNDS';
const DECREMENT_ROUNDS = "DECREMENT ROUNDS";
const CHECK_ROUND = "CHECK_ROUND";
const COLLECT_COIN = "COLLECT_COIN";
const SET_COINS = "SET_COINS";
const CREATE_INTERVAL = "CREATE_INTERVAL";
const DESTROY_INTERVAL = "DESTROY_INTERVAL";
const SET_EMOTION = "SET_EMOTION";
const SET_GAME_STATE = "SET_GAME_STATE";

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

export function collectCoin(position){  
  return {type: COLLECT_COIN, newPositions: newPositions}
}

export function setCoins(positions){
  return {type: SET_COINS, positions: positions}
}

export function setEmotion(emotion){
  return {type: SET_EMOTION, targetEmotion: emotion}
}

export function createInterval(interval){
  return {type: CREATE_INTERVAL}
}

export function destroyInterval(){
  return {type: DESTROY_INTERVAL}
}

export function setGameState(state){
  return {type: SET_GAME_STATE, state: state}
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
      case COLLECT_COIN:
        return Object.assign({}, state, {coinPositions: state.coinPositions.splice(state.coinPositions.indexOf(action.position),1)})
      case SET_COINS:
        return Object.assign({}, state, {coinPositions: action.positions})
      case SET_EMOTION:
        return Object.assign({}, state, {targetEmotion: action.targetEmotion})
      case CREATE_INTERVAL:
        return Object.assign({}, state, {interval: action.interval})
      case DESTROY_INTERVAL: 
        return Object.assign({}, state, {interval: ''})
      case SET_GAME_STATE:
        return Object.assign({}, state, {gameState: action.state})
      default:
        return state;
    }
}

export default reducer
