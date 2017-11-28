import axios from "axios";

//Initial State
const initialState = [];

//Action Types
const GET_FRIENDS = 'GET_FRIENDS';
const ADD_FRIEND = 'ADD_FRIEND';
const REMOVE_FRIEND = 'REMOVE_FRIEND';

//Action Creators
const getFriendsList = (friends) => ({type: GET_FRIENDS, friends});
const addFriend = (friend)  => ({type: ADD_FRIEND, friend});
const removeFriend = (friend) => ({type: REMOVE_FRIEND, friend});


//Thunk Creators
export const addFriendsThunk = (friendId) => dispatch =>{
  axios.post(`/api/users/add/${friendId}`)
  .then(friend => {
    addFriend(friend)
  })
  .catch(next);
}

export const getFriends =  () => dispatch =>
  axios.get('/api/users/friends')
    .then(friends => getFriendsList(friends))
    .catch(console.log);

    //Remove friend thunk needs thinking over
// export const deleteFriend = () => dispatch =>
//   axios.delete()


//Reducer
export default function (state = initialState, action){
  switch(action.type){
    case GET_FRIENDS:
      return state.concat(action.friends);
    case ADD_FRIEND:
      return state.concat(action.friend);
    case REMOVE_FRIEND:
      return state.slice(0,state.indexOf(action.friend)).concat(state.slice(state.indexOf(action.friend)+ 1));
    default:
      return state;
  }
}


