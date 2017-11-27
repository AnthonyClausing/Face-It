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

///only export default for now until containers can be made
export default class Routes extends Component {
  render(){
    
    return (
      <Router history = {history}>
      <Switch>
      <Route exact path='/singlePlayerMode' component={Main}/>
      <Route exact path='/home' component={Home}/>
      <Route component= {Login}/>
      </Switch>
      </Router>
    )
  }
}