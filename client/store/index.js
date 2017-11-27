import { createStore, combineReducers, applyMiddleware } from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleWare from "redux-thunk";
import logger from 'redux-logger';
import roundReducer from './round';
import queueReducer from './queue';
import userReducer from './user';


const reducer = combineReducers({roundReducer, queueReducer,userReducer});

let middleware = composeWithDevTools(applyMiddleware(thunkMiddleWare, logger));

const store = createStore(reducer,middleware);

export default store;
export * from "./round";
export * from "./queue";
export * from "./user";
