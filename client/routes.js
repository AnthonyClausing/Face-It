import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import store from './store';
import Main from './components/main';


///only export default for now until containers can be made
export default class Routes extends Component {
  render(){
    
    return (
      <Router>
      <Switch>
      <Route path='/' component={Main}/>
      </Switch>
      </Router>
    )
  }
}