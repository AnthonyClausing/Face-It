import { createStore, combineReducers, applyMiddleware } from "redux";
// import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleWare from "redux-thunk";
import logger from 'redux-logger';
import roundReducer from './round';
import queue from './queue';
import user from './user';
import friends from './friend';
import gameState from './gameState';
import games from './games';

const reducer = combineReducers({roundReducer, queue,user, friends, gameState, games});

let middleware = applyMiddleware(thunkMiddleWare, logger);

const store = createStore(reducer,middleware);

export default store;
export * from "./round";
export * from "./queue";
export * from "./user";
export * from "./friend";
export * from "./gameState";
export * from "./games";
