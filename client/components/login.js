
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import {connect} from 'react-redux'

import AudioPlayer from './audioPlayer'
import {Loging, Signup} from "./authorization"
import Main from './main'

class Login extends Component  {

    constructor(){
        super()
        this.state = {
            LoginForm: false,
            SignupForm: false,
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
                    <h1 id = 'game-name' >Face-It</h1>
                    <p id = "game-description">An interactive multiplayer webcam game</p>
                </div>
                <div className='login-items'>
                {!this.props.user && <div className = 'login-authorization'>
                    <button className = 'login-authorization-items-login' onClick = {this.handleLogin}  >Login</button>
                    <button className = 'login-authorization-items-signup' onClick = {this.handleSignUp} >Signup</button>
                </div>}
                {!this.props.user && this.state.LoginForm && <Loging/>}
                {!this.props.user && this.state.SignupForm && <Signup/>}
                    {this.props.user && <NavLink to='home' className='login-items' end>EnterGame</NavLink>}
                  <AudioPlayer/>
                </div>
            </div>
        )
    }
}


const mapState = state => {
    return{
        user: state.user.id
    }
}

export default connect(mapState)(Login)
