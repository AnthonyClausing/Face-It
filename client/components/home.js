import React, { Component } from 'react'
import Main from './main'
import { NavLink } from 'react-router-dom'
import {connect} from 'react-redux'
import {logout} from '../store/user'
import Friends from './friendsList'

export class Home extends Component {
    constructor(props) {
        super();
        this.state = {
            videoSource: {},
            open: false
        }
        this.handleVideoSource = this.handleVideoSource.bind(this)
        // this.changeNav = this.changeNav.bind(this)
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

    // changeNav() {
    //     if(!this.state.open) {document.getElementById("mySidenav").style.width = "20%";
    //     this.setState({open:true})}
    //    else {document.getElementById("mySidenav").style.width = "0";
    //     this.setState({open:false})}
    // }
    

    


    render() {
        console.log(this.props.user)
        return (
            <div className="home">
                <div className="sidenav">
                    {this.props.username && <div className = "center-items" ><button className = "home-logout-btn" onClick = {this.props.handleClick}>Logout</button></div>}
                    {/* <h3>User gameStats</h3> */}
                    <NavLink to='training' style={{ textDecoration: 'none' }}><h3 className = "home-page-link" >Training</h3></NavLink>
                    <NavLink to = 'multiplayer' style={{ textDecoration: 'none' }}><h3 className = "home-page-link" >Face-to-Face</h3></NavLink>
                    {/* <NavLink to = 'friends'>Friends</NavLink> */}
                    <div id='friend-list' ><Friends/></div>
                </div>
                <div className ='home-greeting'>
                <h1>Hi {this.props.username ? this.props.username: 'Guest'}</h1>
                <video src = {this.state.videoSource} autoPlay />
                <p>Just checking if your browser supports our game.</p>
                </div>
            </div>
        )
    }

}

const mapState = (state) => {
    return {
        user: state.user,
        username: state.user.userName
    }
}

const mapDispatch = dispatch =>{
    return{
        handleClick(){
            dispatch(logout());
        }
    }
}

const HomePage =  connect(mapState, mapDispatch )(Home)

export default HomePage