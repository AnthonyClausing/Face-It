import React, { Component, useState, useEffect } from 'react'
import Main from './main'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/user'
import Friends from './friendsList'

const Home = function() {
    const [videoStream, setvideoStream] = useState({})
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    useEffect(() => {
        console.log(location, 'location')
        async function getUserMedia(videoBool, audioBool, callback){
            try {
                if (navigator.mediaDevices) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: videoBool ? { width: 1280, height: 720 } : false, audio: audioBool })
                    callback(stream)
                } 
            } catch(e) {
                console.log('getUserMedia() error', e)
            }
        }
        if (navigator.mediaDevices) {
            getUserMedia(true, false, (stream) => { setvideoStream(stream) })
        }
        return () => {
            getUserMedia(true, false, (stream) => {
                let [track] = stream.getTracks()
                track.stop();
            })
        }
    }, [])
    const handleClick = () => dispatch(logout())
    return (
        <div className="home">
            <div className="sidenav">
                {user.username && <div className = "center-items" ><button className = "home-logout-btn" onClick = {handleClick}>Logout</button></div>}
                {/* <h3>User gameStats</h3> */}
                <NavLink to='/training' style={{ textDecoration: 'none' }}><h3 className = "home-page-link" >Training</h3></NavLink>
                <NavLink to = '/multiplayer' style={{ textDecoration: 'none' }}><h3 className = "home-page-link" >Face-to-Face</h3></NavLink>
                {/* <NavLink to = 'friends'>Friends</NavLink> */}
                <div id='friend-list' ><Friends/></div>
            </div>
            <div className ='home-greeting'>
            <h1>Hi {user.username ? user.username: 'Guest'}</h1>
            <video src = {videoStream} autoPlay />
            <p>Just checking if your browser supports our game.</p>
            </div>
        </div>
    )
}

export default Home