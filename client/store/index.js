import { createStore, combineReducers, applyMiddleware } from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleWare from "redux-thunk";
import round from './round';
import queue from './queue';
import user from './user';
import friends from './friend';


const reducer = combineReducers({round, queue,user, friends});

let middleware = composeWithDevTools(applyMiddleware(thunkMiddleWare));

const store = createStore(reducer,middleware);

export default store;
export * from "./round";
export * from "./queue";
export * from "./user";
export * from "./friend";
