import { createStore, combineReducers, applyMiddleware } from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleWare from "redux-thunk";
import logger from 'redux-logger';
import roundReducer from './round';
import queue from './queue';
import user from './user';
import friends from './friend';
import gameState from './gameState';

const reducer = combineReducers({roundReducer, queue,user, friends, gameState});

let middleware = composeWithDevTools(applyMiddleware(thunkMiddleWare, logger));

const store = createStore(reducer,middleware);

export default store;
export * from "./round";
export * from "./queue";
export * from "./user";
export * from "./friend";
export * from "./gameState";

