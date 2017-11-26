import React, {Component} from 'react';
import VideoFeed from './videoFeed';
import io from 'socket.io-client';
import {connectToSite, joinRoom, newRoom, createPeerConnection, doAnswer} from '../socket.js';

const socket = io(window.location.origin);

export default class Main extends Component {
    constructor () {
        super();

        this.pc;
        this.isInitiator = false;

        this.state = {
            emotions: ['angry', 'happy', 'sad', 'surprised', 'redButton', 'blueButton'],
            targetEmotion: '',
            gameState: null,
            score: 0,
            count: 0,
            interval: '',
            matching: false,
            pc: {},
            userVidSource: '',
            userMediaObject: {},
            remoteVidSource: ''
        };

        this.handleVideoSource = this.handleVideoSource.bind(this);
        this.changeTargetEmotion = this.changeTargetEmotion.bind(this);
        this.matchedEmotion = this.matchedEmotion.bind(this);
        this.startGame = this.startGame.bind(this);
        this.handleJoinRoom = this.handleJoinRoom.bind(this);
        this.handleNewRoom = this.handleNewRoom.bind(this);
        this.roomTaken = this.roomTaken.bind(this);
        this.createPeerConnection = createPeerConnection.bind(this);
        this.doAnswer = doAnswer.bind(this);
    }

    componentDidMount() {

      let videoSource;
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(this.handleVideoSource)
          .catch(console.log);
      }
    

    socket.on('connect', () => {
      console.log('Connected!, My Socket Id:', socket.id)
    })
    socket.on('roomTaken', (msg) => {
      console.log(msg);
      document.getElementById('roomTaken').innerHTML = msg;
    })
    socket.on('someoneJoinedTheRoom', () => {
      console.log('someone joined');
      this.isInitiator = true;
      this.createPeerConnection(this.state, socket);
      console.log('pc after someone joined:', this.pc)
    })

    socket.on('signal', message => {
      if (message.type === 'offer') {
        console.log('received offer:', message)
        this.pc.setRemoteDescription(new RTCSessionDescription(message))
        this.doAnswer(socket);
        this.pc.onaddstream = e => {
          console.log('onaddstream', e)
          this.remoteStream = e.stream;
          this.remote = window.URL.createObjectURL(this.remoteStream);
          this.setState({ remoteVidSource: this.remote })
          // this.setState({bridge: 'established'});
        };
      }
      else if (message.type === 'answer') {
        console.log('received answer:', message)
        this.pc.setRemoteDescription(new RTCSessionDescription(message))
        // when the other side added a media stream, show it on screen
        this.pc.onaddstream = e => {
          console.log('onaddstream', e)
          this.remoteStream = e.stream;
          this.remote = window.URL.createObjectURL(this.remoteStream);
          this.setState({ remoteVidSource: this.remote })
          // this.setState({bridge: 'established'});
        };
      }
      // else if (message.type === 'candidate') {

      // }
    })
    }

    roomTaken (msg) {
      document.getElementById('roomTaken').innerHTML = msg;
  }

  handleNewRoom (event) {
      event.preventDefault();
      socket.emit('newRoom', event.target.newRoom.value, socket.id)
      console.log('NEW ROOM', event.target.newRoom.value)
      event.target.newRoom.value = '';
  }

  handleJoinRoom (event) {
      event.preventDefault();
      console.log('pc after join room:', this.pc, this.state)
      this.createPeerConnection(this.state);
      socket.emit('joinRoom', event.target.joinRoom.value)
      event.target.joinRoom.value = '';
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
		this.setState({userVidSource: window.URL.createObjectURL(mediaStream), userMediaObject: mediaStream});
    }

    startGame (event) {
        event.preventDefault();
        this.changeTargetEmotion();
        this.setState({interval: setInterval(this.changeTargetEmotion, 1000), gameState: 'active', count: event.target.numRounds.value});
    }

    changeTargetEmotion () {
        console.log(this.state.gameState);
        if (this.state.count > 0){
            this.setState({targetEmotion: this.state.emotions[Math.floor(Math.random() * this.state.emotions.length)], matching: false, count: this.state.count - 1});
        }  else {
            clearInterval(this.state.interval);
            this.setState({gameState: 'stopped'});
        }
    }

    matchedEmotion () {
        this.setState({matching: true});
    }

    render () {
    //     const videoJsOptions = {//SRC WILL BE UNIQUE TO EACH PERSON IN THE ROOM.
		// 	autoplay: true,
		// 	controls: false,
    //             src: this.state.videoSource
		// };
        return (
            <div id = "single-player">
                <h1> This is the main </h1>

                <form onSubmit={this.handleNewRoom}>
                  <label>
                    Create Room:
                    <input type='text' name='newRoom' />
                  </label>
                  <input type='submit' name='submitNew' />
                </form>
                <form onSubmit={this.handleJoinRoom}>
                  <label>
                    Join Room:
                    <input type='text' name='joinRoom' />
                  </label>
                  <label>
                    Name:
                    <input type='text' name='userName' />
                  </label>
                  <input type='submit' name='submitJoin' />
                </form>

                <VideoFeed matchedEmotion={this.matchedEmotion} videoSource={this.state.userVidSource} target={this.state.targetEmotion} />
                <VideoFeed id='remoteStream' remoteVidSource={this.state.remoteVidSource}/>
                
                <div id="targetEmotion"> Target: {this.state.targetEmotion} </div>

                <div id="success">
                    {
                        this.state.matching ? 'Success' : 'Failing'
                    }
                </div>

                <div id="gameControls">
                    <form onSubmit={this.startGame}>
                        <label>
                            Number of Rounds to Play:
                            <input name="numRounds" type="text" />
                        </label>
                        <input id="startGame" type="submit" disabled={this.state.gameState === 'active'} value="Start Game" />

                    </form>
                </div>
            </div>
        );
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
