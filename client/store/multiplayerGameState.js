//Initial State
 // So when we touch a coin we get points to our score, and get points to spend
 // once we touch a function we subtract from our disposable
const state = {
    p1: '',
    p2: '',
    p1Score: 0,
    p2Score: 0,
    p1disposablePoints: 0,
    p2disposablePoints: 0,
    useP1Points: 0,
    useP2Points: 0
}

//Action
const GET_P1 = "GET_P1"
const GET_P2 = "GET_P2"
const GET_P1_SCORE = "GET_P1_SCORE"
const GET_P2_SCORE = "GET_P2_SCORE"
const GET_P1_DISPOS_POINTS = "GET_P1_DISPOS_POINTS"
const GET_P2_DISPOS_POINTS = "GET_P2_DISPOS_POINTS"
const USE_P1_POINTS = "USE_P1_POINTS"
const USE_P2_POINTS = "USE_P2_POINTS"

//Action Creator
const getP1 = (id)=>{
    type: GET_P1,
    id
}
const getP2 = (id)=>{
    type: GET_P2,
    id
}
const getP1Score = (score)=>{
    type: GET_P1_SCORE,
    score
}
const getP2Score = (score)=>{
    type: GET_P2_SCORE,
    score
}
const getP1DisposablePoints = (points)=>{
    type: GET_P1_DISPOS_POINTS,
    points
}
const getP2DisposablePoints = (points)=>{
    type: GET_P2_DISPOS_POINTS,
    points
}
const useP1Points = (points)=>{
    type: USE_P1_POINTS,
    points
}
const useP2Points = (points)=>{
    type: USE_P2_POINTS,
    points
}


//Reducer
const reducer = function (state = initialState, action){
    switch(action.type){
        case GET_P1:
            return Object.assign({}, state, {p1: action.id});
        case GET_P2:
            return Object.assign({}, state, {p2: action.id});
        case GET_P1_SCORE:
            return Object.assign({}, state, {p1Score: state.p1Score + action.score});
        case GET_P2_SCORE:
            return Object.assign({}, state, {p2Score: state.p2Score + action.score});
        case GET_P1_DISPOS_POINTS:
            return Object.assign({}, state, {p1disposablePoints: state.p1disposablePoints + action.points});
        case GET_P2_DISPOS_POINTS:
            return Object.assign({}, state, {p2disposablePoints: state.p2disposablePoints + action.points});
        case USE_P1_POINTS:
            return Object.assign({}, state, {useP1Points: state.p1disposablePoints - action.points});
        case USE_P2_POINTS:
            return Object.assign({}, state, {useP2Points: state.p2disposablePoints - action.points});           
    }
}