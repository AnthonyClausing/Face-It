//INITIAL STATE
const initialState = [];


//ACTION TYPES
const START_QUEUE = "START_QUEUE";
const GET_NEXT_ITEM = "GET_NEXT_ITEM";
const CHECK_QUEUE = "CHECK_QUEUE";


//ACTION CREATORS
export function startQueue(){
  return{type:START_QUEUE}
}

export function getNextItem(){
  return {type:GET_NEXT_ITEM}

}
export function checkQueue(){
  return {type: CHECK_QUEUE}
}

//REDUCER
const reducer = function (state=initialState, action){
    switch(action.type){
      case START_QUEUE:
        return;
      case GET_NEXT_ITEM:
        return;
      case CHECK_QUEUE:
        return;
      default:
        return state;
    }
};

export default reducer;