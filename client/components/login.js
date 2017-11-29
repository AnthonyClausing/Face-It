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
            SignupForm: false,
            volume: .5
        }
        this.handleSignUp = this.handleSignUp.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
        this.handleVolume = this.handleVolume.bind(this)
    }

    componentDidMount(){
        this.rap.audioEl.volume = this.state.volume;
    }
    handleSignUp(){
        
        this.setState({LoginForm: false, SignupForm: !this.state.SignupForm})
    }

    handleLogin(){
        this.setState({SignupForm: false, LoginForm: !this.state.LoginForm})
    }
    handleVolume(){
        this.state.volume ? this.setState({volume : 0}) : this.setState({volume: 0.5})
        this.rap.audioEl.volume = this.rap.audioEl.volume ? 0 : 0.5; 
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
                    <button className = 'login-authorization-items' onClick = {this.handleLogin}  >Login</button>
                    <button className = 'login-authorization-items' onClick = {this.handleSignUp} >Signup</button>
                </div>}
                {!this.props.user && this.state.LoginForm && <Loging/>}
                {!this.props.user && this.state.SignupForm && <Signup/>}
                    {this.props.user && <NavLink to='/home' className='login-items'>EnterGame</NavLink>}
                    <div className = 'center-items'>
                        {this.state.volume ? 
                            <img src ='images/002-speaker.png' onClick={this.handleVolume}></img>
                            :
                            <img src ='images/001-speaker-1.png' onClick={this.handleVolume}></img> 
                        }
                        </div>
                    <div id = 'audio-login'>
                    <ReactAudioPlayer
                        ref = { element => this.rap = element}
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


const mapState = state => {
    return{
        user: state.user.id
    }
}

export default connect(mapState)(Login)