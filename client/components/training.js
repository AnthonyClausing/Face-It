import React, { Component, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import VideoFeed from './videoFeed'
import store, { collectCoin, setGameState, setCoins, setEmotion, setRounds, decrementRound, createInterval, destroyInterval, setOpponentScore } from '../store'
import AudioPlayer from './audioPlayer'

const Training = function(){
    const dispatch = useDispatch()
    const [userMediaObject, setMediaObject] = useState({})
    const [matchingEmotion, setmatchingEmotion] = useState(false)
    const gameState = useSelector(state =>state.roundReducer.gameState)
    const positions = useSelector(state =>state.roundReducer.positions)
    const rounds = useSelector(state =>state.roundReducer.rounds)
    const score = useSelector(state =>state.roundReducer.score)
    const emotions = useSelector(state =>state.roundReducer.emotions)
    const interval = useSelector(state =>state.roundReducer.interval)
    const coinCount = useSelector(state =>state.roundReducer.coinCount)
    const targetEmotion = useSelector(state => state.roundReducer.targetEmotion)

    const startGame = function (event) {
        event.preventDefault();
        dispatch(setGameState('active'))
        dispatch(setEmotion(selectRandomEmotion()))
        let coinString = pickPositions(coinCount)
        dispatch(setCoins(coinString))
        dispatch(setRounds(event.target.numRounds.value))
        let interval = setInterval(runGame, 5000)
        dispatch(createInterval(interval))
    }
    const runGame = function() {
        if (rounds > 1) {
            dispatch(setEmotion(selectRandomEmotion()))
            dispatch(setCoins(pickPositions(coinCount)))
            dispatch(decrementRound())
        } else {
            clearInterval(interval);
            dispatch(setCoins(''))
            dispatch(setGameState('stopped'))
        }
    }

    const selectRandomEmotion = function() {
        return emotions[Math.floor(Math.random() * emotions.length)];
    }

    const pickPositions = function(num) {
        let positions = '';
        let possiblePositions = [0, 1, 2, 3, 4, 5, 6];
        for (let i = 0; i < num; i++) {
            positions += (possiblePositions.splice(Math.floor(Math.random() * possiblePositions.length), 1)[0]);
        }
        return positions;
    }

    useEffect(() => {
        async function getUserMedia(videoBool, audioBool, callback){
            try {
                if (navigator.mediaDevices) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: videoBool, audio: audioBool })
                    callback(stream)
                } 
            } catch(e) {
                console.log('getUserMedia() error', e)
            }
        }
        if (navigator.mediaDevices) {
            getUserMedia(true, true, (stream) => { setMediaObject(stream) })
        }
        return () => {
            getUserMedia(true, false, (stream) => {
                let [track] = stream.getTracks()
                track.stop();
                setMediaObject({})
            })
        }
    }, [])
    return (
        <div id="single-player">
            <NavLink to='/home'><img className='home-button' src="./images/home-icon.png"></img></NavLink>
            <p className='game-rules'>Make the same face as the emoji</p>
            <p className='game-rules'>Collect coins when the border is green :)</p>
            <div id='single-player-video-feed'>
                {targetEmotion ?
                    <img className='targetEmotion' id="right" src={'/images/' + targetEmotion + '.png'} /> : null}
                <VideoFeed matchedEmotion={() => setmatchingEmotion(true)} videoSource={userMediaObject} target={targetEmotion}
                    socket={socket}
                />
                {targetEmotion ?
                    <img className='targetEmotion' id="left" src={'/images/' + targetEmotion + '.png'} /> : null}
            </div>
            <div id='gameControls'>
                <form onSubmit={startGame}>
                    <label>
                        Number of Rounds to Play:
                        <input name="numRounds" type="text" />
                    </label>
                    <input id='startGame' type='submit' disabled={gameState === 'active' ? true : false} value='Start Game' />
                </form>
            </div>
            <AudioPlayer />
        </div>
    );
}

export default Training;