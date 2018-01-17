import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import VideoFeed from './videoFeed'
import store, { collectCoin, setGameState, setCoins, setEmotion, setRounds, decrementRound, createInterval, destroyInterval, setOpponentScore } from '../store'
import AudioPlayer from './audioPlayer'

class Training extends Component {
    constructor() {
        super();


        this.state = {
            userVidSource: '',
            userMediaObject: {},
        };

        this.handleVideoSource = this.handleVideoSource.bind(this);
        this.selectRandomEmotion = this.selectRandomEmotion.bind(this);
        this.pickPositions = this.pickPositions.bind(this);
        this.matchedEmotion = this.matchedEmotion.bind(this);
        this.startGame = this.startGame.bind(this);
        this.runGame = this.runGame.bind(this);
    }

    componentDidMount() {
       
        this.props.setEmotion(null)
        this.props.setCoins('')
        this.props.setGameState('stopped')
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




    render() {
        return (
            <div id="single-player">
                <NavLink to='home'><img className='home-button' src="./images/home-icon.png"></img></NavLink>
                <p className='game-rules'>Make the same face as the emoji</p>
                <p className='game-rules'>Collect coins when the border is green :)</p>
                <div id='single-player-video-feed'>
                    {this.props.targetEmotion ?
                        <img className='targetEmotion' id="right" src={'/images/' + this.props.targetEmotion + '.png'} /> : null}
                    <VideoFeed matchedEmotion={this.matchedEmotion} videoSource={this.state.userVidSource} target={this.state.targetEmotion}
                        socket={socket}
                    />

                    {this.props.targetEmotion ?
                        <img className='targetEmotion' id="left" src={'/images/' + this.props.targetEmotion + '.png'} /> : null}
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
                <AudioPlayer />
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
        coinCount: state.roundReducer.numberOfCoins,
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
