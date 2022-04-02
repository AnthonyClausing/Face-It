import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import {Routes, Route} from 'react-router-dom';
import { connect } from 'react-redux';
import store from './store';
import Main from './components/main';
import Login from './components/login'
import history from './history'
import Home from './components/home'
import {Signup} from './components/authorization'
import {me} from './store/user'
import FriendsList from './components/friendsList';
import Training from './components/training';
import GameStats from './components/gameStats';

class AppRoutes extends Component {

    componentDidMount(){
        this.props.me();
    }
  render(){
    return (
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path='home' element={<Home/>}/>
        <Route path="friends" element={<FriendsList/>}/>
        <Route path='training' element={<Training/>}/>
        <Route path='multiplayer' element={<Main/>}/>
        <Route path="gameStats" element={<GameStats/>}/>
      </Routes>
    )
  }
}

const mapState = state => {
    return {
        isLoggedIn: !!state.user.id,
    }
}

const mapDispatch = {
    me
}

export default connect(mapState, mapDispatch)(AppRoutes) 


