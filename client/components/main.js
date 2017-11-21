import React, {Component} from 'react';
import VideoFeed from './videoFeed';
import {connectToSite, joinRoom, newRoom} from '../socket.js';

export default class Main extends Component {
    constructor () {
        super ();
       
    //     this.handleJoinRoom = this.handleJoinRoom.bind(this);
    //     this.handleNewRoom = this.handleNewRoom.bind(this);
    //     this.rommTaken = this.roomTaken.bind(this);
    this.state = {  
        videoSource : {}
}

 this.handleVideoSource = this.handleVideoSource.bind(this);
    }

    componentDidMount () {

		let videoSource;
		if (navigator.mediaDevices) {
				navigator.mediaDevices.getUserMedia({video: true, audio: true})
				.then(this.handleVideoSource)
				.catch(console.log)
		}
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
		this.setState({videoSource: window.URL.createObjectURL(mediaStream)})
    }
    render () {
        const videoJsOptions = {//SRC WILL BE UNIQUE TO EACH PERSON IN THE ROOM.
			autoplay: true,
			controls: false,
                src: this.state.videoSource
		}
        return (
            <div>
                <VideoFeed videoOptions={videoJsOptions} />
            </div>
        )
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