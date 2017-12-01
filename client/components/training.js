import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player'
import VideoFeed from './videoFeed';

import store from '../store/index.js';
import { collectCoin, setGameState, setCoins, setEmotion, setRounds, decrementRound, createInterval, destroyInterval, setOpponentScore } from '../store/round.js';
import { connect } from 'react-redux';

class Training extends Component {
    constructor () {
        super();

    
        this.state = {
            userVidSource: '',
            userMediaObject: {},
            volume: 0.5
        };

        this.handleVideoSource = this.handleVideoSource.bind(this);
        this.selectRandomEmotion = this.selectRandomEmotion.bind(this);
        this.pickPositions = this.pickPositions.bind(this);
        this.matchedEmotion = this.matchedEmotion.bind(this);
        this.startGame = this.startGame.bind(this);
        this.runGame = this.runGame.bind(this);
        this.handleVolume = this.handleVolume.bind(this)
    }

    componentDidMount() {

        let videoSource;
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(this.handleVideoSource)
                .catch(console.log);
        }
    }


    handleVideoSource(mediaStream) {
        this.setState({ userVidSource: window.URL.createObjectURL(mediaStream), userMediaObject: mediaStream });
    }

    startGame(event) {
        event.preventDefault();
        this.props.setGameState('active')
        this.props.setEmotion(this.selectRandomEmotion());
        let coinString = this.pickPositions(this.props.coinCount);
        this.props.setCoins(coinString);
        this.props.setRounds(event.target.numRounds.value);
        let interval = setInterval(this.runGame, 5000)
        this.props.createInterval(interval);
    }

    runGame() {
        if (this.props.rounds > 1) {
            this.props.setEmotion(this.selectRandomEmotion());
            this.props.setCoins(this.pickPositions(this.props.coinCount));
            this.props.decrementRound();
        } else {
            clearInterval(this.props.interval);
            this.props.setCoins('');
            this.props.setGameState('stopped');
        }
    }

    pickPositions(num) {
        let positions = '';
        let possiblePositions = [0, 1, 2, 3, 4, 5, 6];
        for (let i = 0; i < num; i++) {
            positions += (possiblePositions.splice(Math.floor(Math.random() * possiblePositions.length), 1)[0]);
        }
        return positions;
    }

    selectRandomEmotion() {
        return this.props.emotions[Math.floor(Math.random() * this.props.emotions.length)];
    }

    matchedEmotion() {
        this.setState({ matching: true });
    }

    handleVolume(){
        this.state.volume ? this.setState({volume : 0}) : this.setState({volume: 0.5})
        this.rap.audioEl.volume = this.rap.audioEl.volume ? 0 : 0.5; 
    }


    render() {
        return (
            <div id="single-player">
            <p className='game-rules'>Make the same face as the emoji</p>
            <p className='game-rules'>Collect coins when the border is green :)</p>
            <div id = 'single-player-video-feed'>
                {this.props.targetEmotion ?
                        <img className='targetEmotion' id = "right" src={'/images/' + this.props.targetEmotion + '.png'} /> : null}
        
                    <VideoFeed matchedEmotion={this.matchedEmotion} videoSource={this.state.userVidSource} target={this.state.targetEmotion} 
                    socket = {socket}
                    />
        
                    {this.props.targetEmotion ?
                        <img className='targetEmotion' id = "left" src={'/images/' + this.props.targetEmotion + '.png'} /> : null}
                </div>
                <div id='gameControls'>
                    <form onSubmit={this.startGame}>
                        <label>
                            Number of Rounds to Play:
                            <input name="numRounds" type="text" />
                        </label>
                        <input id='startGame' type='submit' disabled={this.props.gameState === 'active' ? true : false} value='Start Game' />
                    </form>
                </div>
                <div className='center-items' >
                {this.state.volume ? 
                    <img src ='images/002-speaker.png' className="audio-controller" onClick={this.handleVolume}></img>
                    :
                    <img src ='images/001-speaker-1.png' className="audio-controller" onClick={this.handleVolume}></img> 
                }
                <div className = 'audio-login'>
                    <ReactAudioPlayer
                        ref={element => this.rap = element}
                        src="pokemon-black-white.mp3"
                        loop
                        autoPlay
                        controls
                        volume="0.5"
                    />
                    </div>
                    
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        gameState: state.roundReducer.gameState,
        positions: state.roundReducer.coinPositions,
        rounds: state.roundReducer.rounds,
        score: state.roundReducer.score,
        emotions: state.roundReducer.emotions,
        interval: state.roundReducer.interval,
        coinCount: state.roundReducer.numberOfCoins + 3,
        targetEmotion: state.roundReducer.targetEmotion
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCoins: (pos) => {
            dispatch(setCoins(pos))
        },
        setEmotion: (emotion) => {
            dispatch(setEmotion(emotion))
        },
        setRounds: (rounds) => {
            dispatch(setRounds(rounds))
        },
        decrementRound: () => {
            dispatch(decrementRound());
        },
        createInterval: (interval) => {
            dispatch(createInterval(interval))
        },
        destroyInterval: () => {
            dispatch(destroyInterval());
        },
        setGameState: (gameState) => {
            dispatch(setGameState(gameState));
        },
        setOpponentScore: (user, score) => {
            dispatch(setOpponentScore(score))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Training);
