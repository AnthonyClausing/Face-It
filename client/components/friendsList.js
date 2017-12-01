import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getFriends, addFriendsThunk, deleteFriend} from '../store/friend'

class FriendsList extends Component{
  constructor(props){
    super()
  }
  ComponentDidMount(){
    this.props.getFriends();
  }  
   render(){
     console.log(this.props)
    const {friends} = this.props;
  return (
    <div id="friends-list">
    <form id="friend-adder" onSubmit={this.props.handleAddFriend}>
      <input id="friend-input" type="text" placeholder="Add Friend" name="username"></input>
      <button type="submit" id="add-friend">Add</button>
    </form>
    <div className = "overflow-scroll">
   <ul>
    {
       friends && friends.map( friend =>{
       return (<li key={friend.id}>{friend.userName}<img className="remove-friend" src="./images/trash-friends.png" key={friend.id} onClick={this.props.handleRemoveFriend} alt={friend.id}/></li>)
      })
     }
    </ul>
    </div>
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
      
      let friendId = event.target.alt
      console.log("**********EVENT************",event.target.alt)
      dispatch(deleteFriend(friendId));
    }
  }
}
export default connect(mapState,mapDispatch)(FriendsList);
