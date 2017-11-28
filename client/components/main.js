import React, {Component} from 'react';
import VideoFeed from './videoFeed';
import store from '../store/index.js';
import {collectCoin, setGameState, setCoins, setEmotion, setRounds, decrementRound, createInterval, destroyInterval} from '../store/round.js';
import {connect} from 'react-redux';

class Main extends Component {
    constructor () {
        super ();

        this.handleVideoSource = this.handleVideoSource.bind(this);
        this.selectRandomEmotion = this.selectRandomEmotion.bind(this);
        this.pickPositions = this.pickPositions.bind(this);
        this.matchedEmotion = this.matchedEmotion.bind(this);
        this.startGame = this.startGame.bind(this);
        this.runGame = this.runGame.bind(this);
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
        this.props.setGameState('active')
        this.props.setEmotion(this.selectRandomEmotion());
        let coinString = this.pickPositions(this.props.coinCount);
        this.props.setCoins(coinString);
        this.props.setRounds(event.target.numRounds.value);
        let interval = setInterval(this.runGame, 5000)
        this.props.createInterval(interval);
    }

    runGame () {
        if (this.props.rounds > 1) {
            console.log('interval', this.props.interval);
            this.props.setEmotion(this.selectRandomEmotion());
            this.props.setCoins(this.pickPositions(this.props.coinCount));
            this.props.decrementRound();
        } else {
            clearInterval(this.props.interval);
            this.props.setCoins('');
            this.props.setGameState('stopped');
        }
    }

    pickPositions (num) {
        let positions = '';
        let possiblePositions = [0,1,2,3,4,5,6];
        for (let i=0; i<num; i++){
            positions += (possiblePositions.splice(Math.floor(Math.random()*possiblePositions.length), 1)[0]);
        }
        return positions;
    }

    selectRandomEmotion () {
        return this.props.emotions[Math.floor(Math.random()*this.props.emotions.length)];
    }

    matchedEmotion () {
        this.setState({matching:true});
    } 

    render () {
        console.log(this.props.positions.length);
        return (
            <div id = "single-player">
            {
                <VideoFeed pos={this.props.positions} />
            }   
                <div id='targetEmotion'>
                    {this.props.targetEmotion ? 
                    <img src={'/images/' + this.props.targetEmotion + '.png'} /> : null}
                </div>

                <div id='gameControls'>
                    <form onSubmit={this.startGame}>
                        <label> 
                            Number of Rounds to Play:
                            <input name='numRounds' type='text' />
                        </label>
                        <input id='startGame' type='submit' disabled={this.props.gameState === 'active' ? true : false} value='Start Game' />

                    </form>
                </div>

                <div id='gameScore'>
                    {this.props.score}
                </div>
            </div>
        )
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
        coinCount : state.roundReducer.numberOfCoins,
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
