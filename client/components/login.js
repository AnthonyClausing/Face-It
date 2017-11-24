import React, { Component } from 'react'
import Main from './main'
import { NavLink } from 'react-router-dom'

export default class Login extends Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div id='login-page'>
                <div className='login-header'>
                    <h1>Face-It</h1>
                    <p>An interactive multiplayer webcam game</p>
                </div>
                <div className='login-items'>
                    <input className='login-items' placeholder='name'></input>
                    <NavLink to='/home' className='login-items'>EnterGame</NavLink>
                    <audio autoPlay ='true' controls>
                        <source src="http://192.254.184.234/~tangh/01_admin_resources/Shimmer/ogg/Smile.ogg" type="audio/ogg"></source>
                        <source src="http://192.254.184.234/~tangh/01_admin_resources/Shimmer/mp3/Smile.mp3" type="audio/mpeg"></source>
                    </audio>
                </div>
            </div>
        )
    }

}



