import { createStore, combineReducers, applyMiddleware } from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleWare from "redux-thunk";
import roundReducer from './round';
import queueReducer from './queue';
import user from './user';


const reducer = combineReducers({roundReducer, queueReducer,user});

let middleware = composeWithDevTools(applyMiddleware(thunkMiddleWare));

const store = createStore(reducer,middleware);

export default store;
export * from "./round";
export * from "./queue";
export * from "./user";
