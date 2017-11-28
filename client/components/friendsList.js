import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getFriends, addFriendsThunk, deleteFriend} from '../store/friend'

class FriendsList extends Component{
  constructor(props){
    super()
  }
  ComponentWillMount(){
    this.props.getFriends();
  }  
   render(){
     console.log(this.props)
    const {friends} = this.props;
  return (
    <div>
   <ul>
    {
       friends && friends.map( friend =>{
       return (<li key={friend.id}>{friend.userName}<button key={friend.id} onClick={this.props.handleRemoveFriend} value={friend.id}>X</button></li>)
      })
     }
    </ul>
    <form onSubmit={this.props.handleAddFriend}>
      <input type="text" placeholder="Enter Friend's Username" name="username"></input>
      <button type="submit">Add</button>
    </form>
    </div>
   )
  }
}

const mapState = state => {
  return{
  friends : state.friends
  }
}
const mapDispatch = dispatch =>{
  return {
    getFriends: dispatch(getFriends()),
    handleAddFriend(event) {
      event.preventDefault();
      let name = event.target.username.value
     dispatch(addFriendsThunk(name))
    },
    handleRemoveFriend(event){
      event.preventDefault();
      let friendId = event.target.value
      dispatch(deleteFriend(friendId));
    }
  }
}
export default connect(mapState,mapDispatch)(FriendsList);
