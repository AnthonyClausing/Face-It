import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import ReactAudioPlayer from 'react-audio-player'

import {Loging, Signup} from "./authorization"
import Main from './main'

export default class Login extends Component  {

    constructor(){
        super()
        this.state = {
            LoginForm: false,
            SignupForm: false
        }
        this.handleSignUp = this.handleSignUp.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
    }

    handleSignUp(){
        
        this.setState({LoginForm: false, SignupForm: !this.state.SignupForm})
    }

    handleLogin(){
        this.setState({SignupForm: false, LoginForm: !this.state.LoginForm})
    }

    render(){
        return (
            <div id='login-page'>
                <div className='login-header'>
                    <h1>Face-It</h1>
                    <p>An interactive multiplayer webcam game</p>
                </div>
                <div className='login-items'>
                <div className = 'login-authorization'>
                    <button className = 'login-authorization-items' onClick = {this.handleLogin}  >Login</button>
                    <button className = 'login-authorization-items' onClick = {this.handleSignUp} >Signup</button>
                </div>
                {this.state.LoginForm && <Loging/>}
                    {/* <input className='login-items' placeholder='name' autoFocus></input> */}
                {this.state.SignupForm && <Signup/>}
                    <NavLink to='/home' className='login-items'>EnterGame</NavLink>
                    <div className = 'audio-center'>
                    <ReactAudioPlayer
                        src="pokemon-black-white.mp3"
                        loop
                        autoPlay
                        controls
                    />
                    </div>
                </div>
            </div>
        )
    }
}



