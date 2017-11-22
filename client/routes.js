import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import store from './store';
import Main from './components/main';
import Login from './components/login'
import history from './history'

///only export default for now until containers can be made
export default class Routes extends Component {
  render(){
    
    return (
      <Router history = {history}>
      <Switch>
      <Route path='/home' component={Main}/>
      <Route component= {Login}/>
      </Switch>
      </Router>
    )
  }
}