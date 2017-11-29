//Initial State
const initialState = {
  rounds: 0,
  numberOfCoins: 2,
  coinPositions: '',
  gameState: null,
  targetEmotion: '',
  matching: false,
  score: 0,
  opponentScore: 0,
  count: 0,
  interval: 0,
  emotions: ['angry', 'happy', 'sad', 'surprised']
}

//ACTIONS
const SET_ROUNDS = 'SET_ROUNDS';
const DECREMENT_ROUNDS = "DECREMENT ROUNDS";
const CHECK_ROUND = "CHECK_ROUND";
const INCREMENT_SCORE = "INCREMENT_SCORE";
const SET_OPPONENT_SCORE = "SET_OPPONENT_SCORE";
const SET_COINS = "SET_COINS";
const CREATE_INTERVAL = "CREATE_INTERVAL";
const DESTROY_INTERVAL = "DESTROY_INTERVAL";
const SET_EMOTION = "SET_EMOTION";
const SET_GAME_STATE = "SET_GAME_STATE";
const TOGGLE_CANVAS_CLASS = "TOGGLE_CANVAS_CLASS";

//ACTION CREATORS
export function setRounds(num){
  return {type: SET_ROUNDS, rounds: num}
}

export function decrementRound(num){
  return {type: DECREMENT_ROUNDS, rounds: num}
}

export function checkRound(){
  return {type: CHECK_ROUND}
}

export function incrementScore(){
  return {type: INCREMENT_SCORE}
}

export function setOpponentScore(score){
  return {type: SET_OPPONENT_SCORE, score:score}
}

export function setCoins(positions){
  return {type: SET_COINS, coinPositions: positions}
}

export function setEmotion(emotion){
  return {type: SET_EMOTION, targetEmotion: emotion}
}

export function createInterval(interval){
  return {type: CREATE_INTERVAL, interval: interval}
}

export function destroyInterval(){
  return {type: DESTROY_INTERVAL}
}

export function setGameState(state){
  return {type: SET_GAME_STATE, state: state}
}

export function toggleCanvasClass(){
  return {type: TOGGLE_CANVAS_CLASS}
}

//Reducer
const reducer = function(state = initialState, action){
    switch(action.type){
      case SET_ROUNDS:
        return Object.assign({}, state, {rounds : action.rounds});
      case DECREMENT_ROUNDS:
        return Object.assign({}, state, {rounds: state.rounds-1});
      case CHECK_ROUND:
        return state.rounds
      case INCREMENT_SCORE:
        return Object.assign({}, state, {score: state.score+1})
      case SET_OPPONENT_SCORE:
        return Object.assign({}, state, {opponentScore:action.score})
      case SET_COINS:
        return Object.assign({}, state, {coinPositions: action.coinPositions})
      case SET_EMOTION:
        return Object.assign({}, state, {targetEmotion: action.targetEmotion})
      case CREATE_INTERVAL:
        console.log('action', action.interval)
        return Object.assign({}, state, {interval: action.interval})
      case DESTROY_INTERVAL: 
        return Object.assign({}, state, {interval: 0})
      case SET_GAME_STATE:
        return Object.assign({}, state, {gameState: action.state})
      case TOGGLE_CANVAS_CLASS:
        return Object.assign({}, state, {matching: !state.matching})
      default:
        return state;
    }
}

export default reducer
