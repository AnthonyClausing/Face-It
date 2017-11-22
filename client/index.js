import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Routes from './routes';

ReactDOM.render (

    <Routes />,
  
    document.getElementById('app')
)