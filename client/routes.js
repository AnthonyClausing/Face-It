import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import store from './store';
import Main from './components/main';
import Login from './components/login'
import history from './history'
import Home from './components/home'
import {Signup} from './components/authorization'
import {me} from './store/user'
import FriendsList from './components/friendsList';

class Routes extends Component {

    componentDidMount(){
        this.props.me();
    }
  render(){
    return (
      <Router history = {history}>
      <Switch>
      <Route exact path='/singlePlayerMode' component={Main}/>
      <Route exact path='/home' component={Home}/>
      <Route component= {Login}/>
      <Route exact path="/friends" component={FriendsList}/>
      </Switch>
      </Router>
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

export default connect(mapState, mapDispatch)(Routes) 


