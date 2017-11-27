import React, { Component } from 'react';
import Main from './main';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {getMediaSourceThunk} from '../store';

export class Home extends Component {
    constructor(props) {
        super();
        this.state = {
            open: false
        }
        this.changeNav = this.changeNav.bind(this)
    }

    componentWillMount() {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => this.props.getMediaSourceThunk(stream))
                .catch(console.log)
        }
    }
    componentDidMount(){
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => this.props.getMediaSourceThunk(stream))
                .catch(console.log)
        }
    }
   

    componentWillUnmount() {
        navigator.getUserMedia({ audio: false, video: true },
            function (stream) {
                var track = stream.getTracks()[0];  // if only one media track
                // ...
                track.stop();
            },
            function (error) {
                console.log('getUserMedia() error', error);
            });
    }
    changeNav() {
        if(!this.state.open) {document.getElementById("mySidenav").style.width = "20%";
        this.setState({open:true})}
       else {document.getElementById("mySidenav").style.width = "0";
        this.setState({open:false})}
    }
    

    


    render() {
        console.log(this.props)
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
                <h1>Hi {this.props.username ? this.props.username: 'Guest'}</h1>
                {this.props.src ? < video src = {this.props.src} autoPlay /> : <h1>hello</h1>}
                <p>Just checking if your browser supports our game.</p>
                </div>
            </div>
        )
    }

}

const mapState = (state) => {
    return {
        user: state.user,
        username: state.user.email,
        src : state.src
    }
}
const mapDispatch = {
       getMediaSourceThunk
    }

const HomePage =  connect(mapState, mapDispatch)(Home)

export default HomePage