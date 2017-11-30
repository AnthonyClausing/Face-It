import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player'
import VideoFeed from './videoFeed';
import io from 'socket.io-client';
import { createPeerConnection, doAnswer} from '../socket.js';

const socket = io(window.location.origin);
import store from '../store/index.js';
import { collectCoin, setGameState, setCoins, setEmotion, setRounds, decrementRound, createInterval, destroyInterval, setOpponentScore } from '../store/round.js';
import { connect } from 'react-redux';

class Main extends Component {
    constructor () {
        super();

        this.pc = null;
        this.isInitiator = false;

        this.state = {
            pc: {},
            userVidSource: '',
            userMediaObject: {},
            remoteVidSource: '',
            volume: 0.5
        };

        this.handleVideoSource = this.handleVideoSource.bind(this);
        this.selectRandomEmotion = this.selectRandomEmotion.bind(this);
        this.pickPositions = this.pickPositions.bind(this);
        this.matchedEmotion = this.matchedEmotion.bind(this);
        this.startGame = this.startGame.bind(this);
        this.runGame = this.runGame.bind(this);
        this.handleJoinRoom = this.handleJoinRoom.bind(this);
        this.handleNewRoom = this.handleNewRoom.bind(this);
        this.roomTaken = this.roomTaken.bind(this);
        this.createPeerConnection = createPeerConnection.bind(this);
        this.doAnswer = doAnswer.bind(this);
        this.handleVolume = this.handleVolume.bind(this)
    }

    componentDidMount() {

        let videoSource;
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(this.handleVideoSource)
                .catch(console.log);
        }
    

        socket.on('connect', () => {
            console.log('Connected!, My Socket Id:', socket.id);
        });
        socket.on('roomTaken', (msg) => {
            console.log(msg);
            document.getElementById('roomTaken').innerHTML = msg;
        });
        socket.on('someoneJoinedTheRoom', () => {
            console.log('someone joined');
            this.isInitiator = true;
            this.createPeerConnection(this.state, socket);
            console.log('pc after someone joined:', this.pc);
        });
        socket.on('otherScore', ({user,score}) =>{
            this.props.setOpponentScore(user, score)
            console.log('this is user:', user)
            console.log('this is score: ', score)
        })
        socket.on('signal', message => {
            if (message.type === 'offer') {
                console.log('received offer:', message);
                this.pc.setRemoteDescription(new RTCSessionDescription(message));
                this.doAnswer(socket);
                this.pc.onaddstream = e => {
                    console.log('onaddstream', e);
                    this.remoteStream = e.stream;
                    this.remote = window.URL.createObjectURL(this.remoteStream);
                    this.setState({ remoteVidSource: this.remote });
                };
            }
            else if (message.type === 'answer') {
                console.log('received answer:', message);
                this.pc.setRemoteDescription(new RTCSessionDescription(message));
                // when the other side added a media stream, show it on screen
                this.pc.onaddstream = e => {
                    console.log('onaddstream', e);
                    this.remoteStream = e.stream;
                    this.remote = window.URL.createObjectURL(this.remoteStream);
                    this.setState({ remoteVidSource: this.remote });
                };
            }
            else if (message.type === 'candidate') {
                this.pc.addIceCandidate(
                    new RTCIceCandidate({
                        sdpMLineIndex: message.mlineindex,
                        candidate: message.candidate
                    })
                );
            }
        });
    }

    roomTaken(msg) {
        document.getElementById('roomTaken').innerHTML = msg;
    }

    handleNewRoom(event) {
        event.preventDefault();
        socket.emit('newRoom', event.target.newRoom.value, socket.id);
        console.log('NEW ROOM', event.target.newRoom.value);
        event.target.newRoom.value = '';
    }

    handleJoinRoom(event) {
        event.preventDefault();
        this.createPeerConnection(this.state);
        console.log('pc after join room:', this.pc, this.state);
        socket.emit('joinRoom', event.target.joinRoom.value);
        event.target.joinRoom.value = '';
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
        console.log(this.props.positions.length);
        return (
            <div id="single-player">
                <p>To play this game you have to match the emojis when the border turns green grab the coins</p>
                <form onSubmit={this.handleNewRoom}>
                    <label>
                        Create Room:
            <input type="text" name="newRoom" />
                    </label>
                    <input type="submit" name="submitNew" />
                </form>
                <form onSubmit={this.handleJoinRoom}>
                    <label>
                        Join Room:
            <input type="text" name="joinRoom" />
                    </label>
                    <label>
                        Name:
            <input type="text" name="userName" />
                    </label>
                    <input type="submit" name="submitJoin" />
                </form>
                {
                    this.state.userVidSource &&

                    <VideoFeed matchedEmotion={this.matchedEmotion} videoSource={this.state.userVidSource} target={this.state.targetEmotion} 
                    socket = {socket}
                    />
                }
                {
                    this.state.remoteVidSource &&
                    <VideoFeed remoteVidSource={this.state.remoteVidSource} />
                }
                <div className='targetEmotion'>
                    {this.props.targetEmotion ?
                        <img src={'/images/' + this.props.targetEmotion + '.png'} /> : null}
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
                <div id='gameScore'>
                    {this.props.score}
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

export default connect(mapStateToProps, mapDispatchToProps)(Main);
