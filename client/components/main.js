
import React, { Component } from 'react';
import io from 'socket.io-client';
import {NavLink} from 'react-router-dom';
import { connect } from 'react-redux';

import { createPeerConnection, doAnswer } from '../socket.js';
import  store , {collectCoin, setGameState, setNumberCoins, setCoins, setEmotion, setRounds, decrementRound, createInterval, destroyInterval,setOpponentScore, blackoutScreen, reviveScreen, decreaseScore, setUserScore} from '../store';
import VideoFeed from './videoFeed';
import AudioPlayer from './audioPlayer';

const socket = io(window.location.origin);

class Main extends Component {
    constructor() {
        super();

        this.pc = null;
        this.isInitiator = false;

        this.state = {
            pc: {},
            userVidSource: '',
            userMediaObject: {},
            remoteVidSource: '',
            roomName: '',
            opponentBlack: false,
            opponentEmotion: '',
            roomTaken: false
        };

        this.handleVideoSource = this.handleVideoSource.bind(this);
        this.selectRandomEmotion = this.selectRandomEmotion.bind(this);
        this.pickPositions = this.pickPositions.bind(this);
        this.matchedEmotion = this.matchedEmotion.bind(this);
        this.startGame = this.startGame.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.runGame = this.runGame.bind(this);
        this.handleJoinRoom = this.handleJoinRoom.bind(this);
        this.handleNewRoom = this.handleNewRoom.bind(this);
        this.roomTaken = this.roomTaken.bind(this);
        this.createPeerConnection = createPeerConnection.bind(this);
        this.doAnswer = doAnswer.bind(this);
        this.handleSpacebar = this.handleSpacebar.bind(this);
    }

    componentDidMount() {
        let videoSource;
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(this.handleVideoSource)
                .catch(console.log);
        }

        window.addEventListener('keyup', this.handleSpacebar, false);

        socket.on('connect', () => {
            console.log('Connected!, My Socket Id:', socket.id);
        });
        socket.on('roomTaken', (msg) => {
            console.log(msg);
            this.setState({roomName: ''})
            document.getElementById('roomTaken').innerHTML = msg;
        });
        socket.on('someoneJoinedTheRoom', () => {
            console.log('someone joined');
            this.isInitiator = true;
            this.createPeerConnection(this.state, socket, this.state.roomName);
            console.log('pc after someone joined:', this.pc);
        });
        socket.on('opponentScored', ({user,score}) =>{
            if (this.props.user != user){
                this.props.setOpponentScore(user, score)
                console.log('this is user:', user)
                console.log('this is score: ', score)
            }
        })
        socket.on('blackoutScreen', () => {
            console.log('screen shold go dark');
            this.props.blackoutScreen();
            setTimeout(this.props.reviveScreen, 2000);
        })
        socket.on('opponentEmotion', (emotion) => {
            this.setState({opponentEmotion: emotion})
            console.log('emotion:::::', emotion);
        })
        socket.on('startGame', (rounds) => {
            console.log('emitting start')
            this.startGame(rounds);
        })
        socket.on('signal', message => {
            if (message.type === 'offer') {
                console.log('received offer:', message);
                this.pc.setRemoteDescription(new RTCSessionDescription(message));

            
                this.doAnswer(socket,this.state.roomName);
                this.pc.onaddstream = e => {
                    console.log('onaddstream', e);
                    this.remoteStream = e.stream;
                    this.remote = window.URL.createObjectURL(this.remoteStream);
                    this.setState({ remoteVidSource: this.remote });
                    //both video feeds are running so alert the room
                    socket.emit('ready', this.state.roomName);
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
                    //both video feeds are running so alert the room
                    socket.emit('ready', this.state.roomName);
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

    handleSpacebar(event) {
        event.preventDefault();
        if (event.keyCode == 32 || event.key == ' '){
            if (this.props.score >= 5){
                this.props.decreaseScore(5)

                //ADDED THINGS HERE

                var user =this.props.user
                var roomName = this.state.roomName
                var score = this.props.score
                socket.emit('blackoutOpponent', roomName);
                socket.emit('updateScore', {score, user, roomName} )
                this.setState({opponentBlack:true})
                setTimeout(() => {this.setState({opponentBlack:false})}, 2000)
            }
        }
    }

    roomTaken(msg) {
        document.getElementById('roomTaken').innerHTML = msg;
        this.setState({roomTaken: true})
    }

    handleNewRoom(event) {
        this.props.setUserScore(0);
        this.props.setOpponentScore(0);
        event.preventDefault();
        this.setState({roomName: event.target.newRoom.value})
        document.getElementById('roomTaken').innerHTML = '';
        socket.emit('newRoom', event.target.newRoom.value, socket.id);
        console.log('NEW ROOM', event.target.newRoom.value);
        event.target.newRoom.value = '';
    }

    handleJoinRoom(event) {
        this.props.setUserScore(0);
        this.props.setOpponentScore(0);
        event.preventDefault();
        this.createPeerConnection(this.state);
        this.setState({roomName: event.target.joinRoom.value})
        console.log('pc after join room:', this.pc, this.state);
        socket.emit('joinRoom', event.target.joinRoom.value);
        event.target.joinRoom.value = '';
    }

    handleVideoSource(mediaStream) {
        this.setState({ userVidSource: window.URL.createObjectURL(mediaStream), userMediaObject: mediaStream });
    }

    handleStart(event){
        event.preventDefault();
        socket.emit('startGame', this.state.roomName, event.target.numRounds.value);
        console.log('START EVENT:', event, 'roomname:', this.state.roomName, '/')
        this.startGame(event.target.numRounds.value);
    }

    startGame(rounds) {
        this.props.setUserScore(0);
        this.props.setOpponentScore(0);
        this.props.setGameState('active')
        this.props.setEmotion(this.selectRandomEmotion());
        socket.emit('newEmotion', this.props.targetEmotion, this.state.roomName);
        let coinString = this.pickPositions(this.props.numberOfCoins);
        this.props.setCoins(coinString);
        this.props.setRounds(rounds);
        let interval = setInterval(this.runGame, 5000)
        this.props.createInterval(interval);
    }

    runGame() {
        if (this.props.rounds > 1) {
            console.log('interval', this.props.interval);
            this.props.setNumberCoins(1);
            this.props.setEmotion(this.selectRandomEmotion());
            socket.emit('newEmotion', this.props.targetEmotion, this.state.roomName);
            this.props.setCoins(this.pickPositions(this.props.numberOfCoins));
            this.props.decrementRound();
        } else {
            clearInterval(this.props.interval);
            this.props.setNumberCoins(1);
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
                <NavLink to = 'home'><img className = 'home-button' src = "./images/home-icon.png"></img></NavLink>
                <p>Once you collect 5 coins, try out the spacebar for a cosmic drink :)</p>
                { this.state.roomName ?
                <div> Your are in the {this.state.roomName} room </div>
                :
                <div className='roomForms'>
                    <form onSubmit={this.handleNewRoom}>
                        <label>
                            {'Create Room: '}
                            <input type="text" name="newRoom" />
                        </label>
                        <input type="submit" name="submitNew" />
                    </form>
                    <form onSubmit={this.handleJoinRoom}>
                        <label>
                            {'Join Room: '}
                            <input type="text" name="joinRoom" />
                        </label>
                        <input type="submit" name="submitJoin" />
                    </form>
                </div>
                }
                <p id = "roomTaken"></p>
                <div id = "multiplayer-feed">
                {
                    this.state.userVidSource &&

                    <VideoFeed matchedEmotion={this.matchedEmotion} videoSource={this.state.userVidSource} target={this.state.targetEmotion} 
                    socket = {socket}
                    roomName = {this.state.roomName}
                    />
                }
                {
                    this.state.remoteVidSource &&
                    <div id='opponentInfo'>
                        <div className='gameScore'>
                            {this.state.opponentEmotion ?
							<img height='80em' width='80em' src={'/images/' + this.state.opponentEmotion + '.png'} /> : null}
                            {'Opponent score: '}
                            {this.props.opponentScore}
                            {this.state.opponentEmotion ?
                                <img height='80em' width='80em' src={'/images/' + this.state.opponentEmotion + '.png'} /> : null}
                        </div>                      
                        <div id='opponentVideo'>                
                            <video 
                                width = '600px'
                                height = '480px'
                                autoPlay="true"
                                src={this.state.remoteVidSource} 
                            /> 
                            {this.state.opponentBlack &&
                                <div className='blackout'> </div> 
                            } 
                        </div>
                    </div>
                }
                </div>
                
                <div id='gameControls'>
                    <form onSubmit={this.handleStart}>
                        <label>
                            {"Number of Rounds to Play: "}
                            <input name="numRounds" type="text" />
                        </label>
                        <input id='startGame' type='submit' disabled={this.props.gameState === 'active' ? true : false} value='Start Game' />
                    </form>
                </div>
                <AudioPlayer/>
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
        opponentScore: state.roundReducer.opponentScore,
        emotions: state.roundReducer.emotions,
        interval: state.roundReducer.interval,
        numberOfCoins: state.roundReducer.numberOfCoins,
        targetEmotion: state.roundReducer.targetEmotion,
        user: state.user.userName
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setNumberCoins: (num) => {
            dispatch(setNumberCoins(num))
        },
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
        },
        blackoutScreen: () => {
            dispatch(blackoutScreen())
        },
        reviveScreen: () => {
            dispatch(reviveScreen())
        },
        decreaseScore: (num) => {
            dispatch(decreaseScore(num))
        },
        setUserScore: (num) => {
            dispatch(setUserScore(num))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
