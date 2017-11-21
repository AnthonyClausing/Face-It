import React, {Component} from 'react';
import VideoFeed from './videoFeed';
import {connectToSite, joinRoom, newRoom} from '../clientSocket.js';

export default class Main extends Component {
    constructor () {
        super ();
        this.state = {  
            socket: {},
            userVidSource: ''
        }

        this.handleVideoSource = this.handleVideoSource.bind(this);
        this.handleJoinRoom = this.handleJoinRoom.bind(this);
        this.handleNewRoom = this.handleNewRoom.bind(this);
        this.rommTaken = this.roomTaken.bind(this);
    }

    componentDidMount () {
        this.setState({socket:connectToSite(this.roomTaken)});
        let vidSource;
        let error = function () {
            console.log('Vid Error');
        }
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({video: true, audio: true},this.handleVideoSource, error);
        }
    }

    roomTaken (msg) {
        document.getElementById('roomTaken').innerHTML = msg;
    }

    handleNewRoom (event) {
        event.preventDefault();
        newRoom(this.state.socket, event.target.newRoom.value);
        event.target.newRoom.value = '';
    }

    handleJoinRoom (event) {
        event.preventDefault();
        joinRoom(this.state.socket, event.target.joinRoom.value)
        event.target.joinRoom.value = '';
    }

    handleVideoSource (mediaStream) {
        this.setState({userVidSource: window.URL.createObjectURL(mediaStream)})
    }

    render () {
        return (
            <div>
                <form onSubmit={this.handleNewRoom}>
                    <label> 
                        Create Room:
                        <input type='text' name='newRoom'/>
                    </label>
                    <input type='submit' name='submitNew'/>
                    <div id='roomTaken'></div>
                </form>
                <form onSubmit={this.handleJoinRoom}>
                    <label>
                        Join Room:
                        <input type='text' name='joinRoom'/>
                    </label>
                    <input type='submit' name='submitJoin'/>
                </form>

                <VideoFeed videoSource={this.state.userVidSource}/>
            </div>
        )
    }
}