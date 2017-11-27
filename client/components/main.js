import React, {Component} from 'react';
import VideoFeed from './videoFeed';
import store from '../store/index.js';
import {collectCoin, setCoins, setEmotion, setRounds, decrementRound, createInterval, destroyInterval} from '../store/round.js';
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
        this.collectCoin = this.collectCoin.bind(this);
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
        this.props.setEmotion(this.selectRandomEmotion());
        this.props.setCoins(this.pickPositions());
        this.props.setRounds(event.target.numRounds.value)
    }

    runGame () {
        if (this.props.rounds > 0) {
            this.props.setEmotion(this.selectRandomEmotion());
            this.props.setCoins(this.pickPositions());
            this.props.decrementRound();
        } else {
            this.props.destroyInterval(); 
        }
    }

    pickPositions () {
        let positions = [];
        let possiblePositions = [0,1,2,3,4,5,6];
        for (let i=0; i<this.state.numberOfCoins; i++){
            positions.push(possiblePositions.splice(Math.floor(Math.random()*possiblePositions.length), 1)[0]);
        }
        return positions;
    }

    selectRandomEmotion () {
        return this.props.emotions[Math.floor(Math.random()*this.props.emotions.length)];
    }

    matchedEmotion () {
        this.setState({matching:true});
    }

    collectCoin (position) {
        let newPositions = this.state.coinPositions.splice(this.state.coinPositions.indexOf(position));
        console.log(newPositions);
        this.setState({score: this.state.score + 1, coinPositions:newPositions})
    }

    render () {
        return (
            <div id = "single-player">

                <VideoFeed />

                <div id='targetEmotion'> Target: {this.props.targetEmotion} </div>

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
        rounds: state.roundReducer.rounds,
        score: state.roundReducer.score,
        emotions: state.roundReducer.emotions,
        interval: state.roundReducer.interval,
        targetEmotion: state.roundReducer.targetEmotion
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCoins: () => {
            dispatch(setCoins)
        },
        setEmotion: (emotion) => {
            dispatch(setEmotion(emotion))
        },
        setRounds: (rounds) => {
            dispatch(setRounds(rounds))
        },
        decrementRound: () => {
            dispatch(decrementRound);
        },
        createInterval: (interval) => {
            dispatch(createInterval(interval))
        },
        destroyInterval: () => {
            dispatch(destroyInterval);
        },
        setGameState: () => {
            dispatch(setGameState);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
