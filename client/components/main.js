import React, {Component} from 'react';
import VideoFeed from './videoFeed';

export default class Main extends Component {
    constructor () {
        super ();
        this.state = {
            emotions: ['angry', 'happy', 'sad', 'surprised'],
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
        let vidSource;
        let error = function () {
            console.log('Vid Error');
        }
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true, audio: true},this.handleVideoSource, error);
        }
    }

    handleVideoSource (mediaStream) {
        this.setState({userVidSource: window.URL.createObjectURL(mediaStream)})
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
        return (
            <div>
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