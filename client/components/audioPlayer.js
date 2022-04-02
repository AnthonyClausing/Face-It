import React, { Component } from 'react'
import ReactAudioPlayer from 'react-audio-player'

export default class AudioPlayer extends Component {
    constructor () {
        super();
        this.state = {
            volume: 0
        };
        this.handleVolume = this.handleVolume.bind(this)
    }

    handleVolume(){
        this.state.volume ? this.setState({volume : 0}) : this.setState({volume: 0.5})
        this.rap.audioEl.volume = this.rap.audioEl.volume ? 0 : 0.5; 
    }

    render() {
        return (<div className='center-items' >
            {this.state.volume ?
                <img src='images/002-speaker.png' className="audio-controller" onClick={this.handleVolume}></img>
                :
                <img src='images/001-speaker-1.png' className="audio-controller" onClick={this.handleVolume}></img>
            }
            <div className='audio-login'>
                <ReactAudioPlayer
                    ref={element => this.rap = element}
                    src="pokemon-black-white.mp3"
                    loop
                    autoPlay
                    controls
                    volume={0.3}
                />
            </div>
        </div>)
    }
}

