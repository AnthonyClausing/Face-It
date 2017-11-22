import React, {Component} from 'react';
import VideoFeed from './videoFeed';
import {connectToSite, joinRoom, newRoom} from '../socket.js';

export default class Main extends Component {
    constructor () {
        super ();
        this.state = {
            emotions: ['angry', 'happy', 'sad', 'surprised', 'redButton', 'blueButton'],
            targetEmotion: '',
            userVidSource: '',
            gameState: null,
            score: 0,
            count: 0,
            interval: '',
            matching: false
        }

        this.handleVideoSource = this.handleVideoSource.bind(this);
        this.changeTargetEmotion = this.changeTargetEmotion.bind(this);
        this.matchedEmotion = this.matchedEmotion.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    componentDidMount () {

		let videoSource;
		if (navigator.mediaDevices) {
				navigator.mediaDevices.getUserMedia({video: true, audio: true})
				.then(this.handleVideoSource)
				.catch(console.log)
		}
     }

    // roomTaken (msg) {
    //     document.getElementById('roomTaken').innerHTML = msg;
    // }

    // handleNewRoom (event) {
    //     event.preventDefault();
    //     newRoom(this.state.socket, event.target.newRoom.value);
    //     event.target.newRoom.value = '';
    // }

    // handleJoinRoom (event) {
    //     event.preventDefault();
    //     joinRoom(this.state.socket, event.target.joinRoom.value)
    //     event.target.joinRoom.value = '';
    // }
    handleVideoSource (mediaStream) {
		this.setState({videoSource: window.URL.createObjectURL(mediaStream)})
    }

    startGame (event) {
        event.preventDefault();
        this.changeTargetEmotion();
        this.setState({interval: setInterval(this.changeTargetEmotion, 1000), gameState: 'active', count: event.target.numRounds.value});
    }

    changeTargetEmotion () {
        console.log(this.state.gameState)
        if (this.state.count > 0){
            this.setState({targetEmotion: this.state.emotions[Math.floor(Math.random()*this.state.emotions.length)], matching:false, count: this.state.count-1});
        }  else {
            clearInterval(this.state.interval);
            this.setState({gameState: 'stopped'})
        }  
    }

    matchedEmotion () {
        this.setState({matching:true});
    }

    render () {
        const videoJsOptions = {//SRC WILL BE UNIQUE TO EACH PERSON IN THE ROOM.
			autoplay: true,
			controls: false,
                src: this.state.videoSource
		}
        return (
            <div id = "single-player">
                <h1> This is the main </h1>

                <VideoFeed matchedEmotion={this.matchedEmotion} videoSource={this.state.userVidSource} target={this.state.targetEmotion}/>

                <div id='targetEmotion'> Target: {this.state.targetEmotion} </div>

                <div id='success'> 
                    {
                        this.state.matching ? 'Success' : 'Failing'                   
                    }                
                </div>

                <div id='gameControls'>
                    <form onSubmit={this.startGame}>
                        <label> 
                            Number of Rounds to Play:
                            <input name='numRounds' type='text' />
                        </label>
                        <input id='startGame' type='submit' disabled={this.state.gameState === 'active' ? true : false} value='Start Game' />

                    </form>
                </div>
            </div>
        )
    }
}
      // <form onSubmit={this.handleNewRoom}>
                //     <label> 
                //         Create Room:
                //         <input type='text' name='newRoom'/>
                //     </label>
                //     <input type='submit' name='submitNew'/>
                //     <div id='roomTaken'></div>
                // </form>
                // <form onSubmit={this.handleJoinRoom}>
                //     <label>
                //         Join Room:
                //         <input type='text' name='joinRoom'/>
                //     </label>
                //     <input type='submit' name='submitJoin'/>
                // </form>