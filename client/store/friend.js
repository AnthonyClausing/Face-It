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
//const removeFriend = (friend) => ({type: REMOVE_FRIEND, friend});


//Thunk Creators
export const addFriendsThunk = (friendName) => dispatch =>{
  axios.post(`/api/users/addFriend`, {friendName})
  .then(res => res.data)
  .then(friend => {
    dispatch(addFriend(friend))
    dispatch(getFriends())
  })
  .catch(console.log);
}
//TODO GO TO AUTHORIZATION!!!!!! TO SEND ERROR
export const getFriends =  () => dispatch =>
  axios.get('/api/users/friends')
    .then(res => res.data)
    .then(friends => {
      dispatch(getFriendsList(friends))})
    .catch(console.log);

export const deleteFriend = (id) => dispatch =>
  axios.delete(`/api/users/friends/${id}`)
      .then(dispatch(getFriends()))
      .catch(console.log);


//Reducer
export default function (state = initialState, action){
  switch(action.type){
    case GET_FRIENDS:
      return action.friends
    case ADD_FRIEND:
      return state.concat(action.friend);
    // case REMOVE_FRIEND:
    //   return state.slice(0,state.indexOf(action.friend)).concat(state.slice(state.indexOf(action.friend)+ 1));
    default:
      return state;
  }
}


