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
            <div className = 'login-header'>
                <h1>Face-It</h1>
                <p>An interactive multiplayer webcam game</p>
            </div> 
            <div className = 'login-items'>
                <input className = 'login-items' placeholder = 'name'></input>
                <NavLink to='/home' className = 'login-items'>EnterGame</NavLink>
            </div>
            </div>
        )
    }
    
}

// //text-align: center;
// display: flex;
// flex-direction: column;
// justify-content: space-between;
// align-items: center;
// width: 100vw;
// height: 100vh;
// }

// {
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;
//     padding: 1em;
//     margin: .1em;
//     border-radius: 10%;
//     transition: all 1.5s ease-in;
//     text-decoration: none;