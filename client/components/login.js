import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import ReactAudioPlayer from 'react-audio-player'
import {connect} from 'react-redux'
import {Loging, Signup} from "./authorization"
import Main from './main'

class Login extends Component  {

    constructor(){
        super()
        this.state = {
            LoginForm: false,
            SignupForm: false
        }
        this.handleSignUp = this.handleSignUp.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
    }

    componentDidMount(){
        console.log(this.rap.audioEl.volume = 0.3)
    }
    handleSignUp(){
        
        this.setState({LoginForm: false, SignupForm: !this.state.SignupForm})
    }

    handleLogin(){
        this.setState({SignupForm: false, LoginForm: !this.state.LoginForm})
    }

    render(){
        console.log(this.props.user)
        
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
                {this.state.SignupForm && <Signup/>}
                    {this.props.user && <NavLink to='/home' className='login-items'>EnterGame</NavLink>}
                    <div className = 'center-items'>
                    <ReactAudioPlayer
                        ref = { element => this.rap = element}
                        src="pokemon-black-white.mp3"
                        loop
                        autoPlay
                        controls
                        volume = "0.5"
                    />
                    </div>
                </div>
            </div>
        )
    }
}


const mapState = state => {
    return{
        user: state.user
    }
}

export default connect(mapState)(Login)