import React, {Component} from 'react'
import Main from './main'
import {NavLink} from 'react-router-dom'

export default class Login extends Component {
    constructor(props){
        super();
    }

    render(){
        return(
            <div id ='login-page'>
                <input className = 'login-items' placeholder = 'name'></input>
                <NavLink to='/home' className = 'login-items'>EnterGame</NavLink>
            </div>
        )
    }
    
}