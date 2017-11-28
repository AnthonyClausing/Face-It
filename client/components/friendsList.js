import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getFriends} from '../store/friend'

class FriendsList extends Component{
  constructor(props){
    super()
  }
  ComponentDidMount(){
    this.props.getFriends();
  }  
   render(){
    const {friends} = this.props;
  return (
   <ul>
    {
       friends.map( friend =>{
       return (<li key={friend.id}>{friend.username}</li>)
      })
     }
    </ul>
   )
  }
}

const mapState = state => {
  friends : state.friend
}
const mapDispatch = dispatch =>{
  return {
    getFriends 
  }
}
export default connect(mapState,mapDispatch)(FriendsList);
