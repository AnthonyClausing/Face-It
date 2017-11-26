import React, {Component} from 'react';
import io from 'socket.io-client';
import VideoFeed from './videoFeed';
import {createPeerConnection, doAnswer} from '../rtc.js';

const socket = io(window.location.origin)

export default class Main extends Component {
    constructor () {
        super ();
        this.pc;
        this.isInitiator = false;

        this.state = {
            pc: {},
            userVidSource: '',
            userMediaObject: {},
            remoteVidSource: ''
        }

        this.handleVideoSource = this.handleVideoSource.bind(this);
        this.handleJoinRoom = this.handleJoinRoom.bind(this);
        this.handleNewRoom = this.handleNewRoom.bind(this);
        this.roomTaken = this.roomTaken.bind(this);
        this.createPeerConnection = createPeerConnection.bind(this)
        this.doAnswer = doAnswer.bind(this)
    }

    componentDidMount () {
        let vidSource;
        let error = function () {
            console.log('Vid Error');
        }
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true, audio: true},this.handleVideoSource, error);
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
            if (message.type === 'offer'){
                console.log('received offer:', message)
                this.pc.setRemoteDescription(new RTCSessionDescription(message))
                this.doAnswer(socket);
                this.pc.onaddstream = e => {
                    console.log('onaddstream', e)
                    this.remoteStream = e.stream;
                    this.remote = window.URL.createObjectURL(this.remoteStream);
                    this.setState({remoteVidSource: this.remote})
                    // this.setState({bridge: 'established'});
                };
            }
            else if (message.type === 'answer'){
                console.log('received answer:', message)
                this.pc.setRemoteDescription(new RTCSessionDescription(message))
                // when the other side added a media stream, show it on screen
                this.pc.onaddstream = e => {
                    console.log('onaddstream', e)
                    this.remoteStream = e.stream;
                    this.remote = window.URL.createObjectURL(this.remoteStream);
                    this.setState({remoteVidSource: this.remote})
                    // this.setState({bridge: 'established'});
                };
            }
            else if (message.type === 'candidate'){

            }
        })
    }

    roomTaken (msg) {
        document.getElementById('roomTaken').innerHTML = msg;
    }

    handleNewRoom (event) {
        event.preventDefault();
        socket.emit('newRoom', event.target.newRoom.value, socket.id)
        event.target.newRoom.value = '';
    }

    handleJoinRoom (event) {
        event.preventDefault();
        this.createPeerConnection(this.state);
        console.log('pc after join room:', this.pc)
        socket.emit('joinRoom', event.target.joinRoom.value)
        event.target.joinRoom.value = '';
    }

    handleVideoSource (mediaStream) {
        this.setState({userVidSource: window.URL.createObjectURL(mediaStream), userMediaObject: mediaStream})
        console.log(this.state.userVidSource)
    }

    render () {
        console.log('HEREEEEE',this.state.userVidSource, this.state.remoteVidSource)
        return (
            <div>
                <form onSubmit={this.handleNewRoom}>
                    <label> 
                        Create Room:
                        <input type='text' name='newRoom'/>
                    </label>
                    <input type='submit' name='submitNew'/>
                </form>
                <form onSubmit={this.handleJoinRoom}>
                    <label>
                        Join Room:
                        <input type='text' name='joinRoom'/>
                    </label>
                    <label>
                        Name:
                        <input type='text' name='userName'/>
                    </label>
                    <input type='submit' name='submitJoin'/>
                </form>

                <div id='roomTaken'></div>

                <VideoFeed id='localStream' videoSource={this.state.userVidSource} />
                <VideoFeed id='remoteStream' remoteVidSource={this.state.remoteVidSource}/>
            </div>
        )
    }
}