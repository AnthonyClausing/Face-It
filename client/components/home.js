import React, { Component } from 'react'
import Main from './main'
import { NavLink } from 'react-router-dom'

export default class Home extends Component {
    constructor(props) {
        super();
        this.state = {
            videoSource: {},
            open: false
        }
        this.handleVideoSource = this.handleVideoSource.bind(this)
        this.changeNav = this.changeNav.bind(this)
    }

    componentDidMount() {
        let videoSource;
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(this.handleVideoSource)
                .catch(console.log)
        }
    }

    componentWillUnmount() {
        navigator.getUserMedia({ audio: false, video: true },
            function (stream) {
                console.log(stream)
                var track = stream.getTracks()[0];  // if only one media track
                // ...
                track.stop();
            },
            function (error) {
                console.log('getUserMedia() error', error);
            });
    }

    handleVideoSource(mediaStream) {
        this.setState({ videoSource: window.URL.createObjectURL(mediaStream) })
    }

    changeNav() {
        if(!this.state.open) {document.getElementById("mySidenav").style.width = "250px";
        this.setState({open:true})}
       else {document.getElementById("mySidenav").style.width = "0";
        this.setState({open:false})}
    }
    

    


    render() {
        return (
            <div className="home">
                <div id="mySidenav" className="sidenav">
                    <h3>User gameStats</h3>
                    <NavLink to='singlePlayerMode'>Single Player</NavLink>
                    <h3>Multiplayer</h3>
                    <p>Join Room and create room will be here after toggle</p>
                </div>
                <span onClick={this.changeNav}>&#9776; toggle</span>
                <div className ='home-greeting'>
                <h1>Hi username here</h1>
                <video src = {this.state.videoSource} autoPlay />
                <p>Just checking if your browser supports our game.</p>
                </div>
            </div>
        )
    }

}

