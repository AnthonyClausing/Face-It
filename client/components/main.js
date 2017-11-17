import React, {Component} from 'react';
import VideoFeed from './videoFeed';

export default class Main extends Component {
    constructor () {
        super ();
        this.state = {
            userVidSource: ''
        }

        this.handleVideoSource = this.handleVideoSource.bind(this);
    }

    componentDidMount () {
        let vidSource;
        let error = function () {
            console.log('Vid Error');
        }
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true, audio: true},this.handleVideoSource, error);
        }
    }

    handleVideoSource (mediaStream) {
        this.setState({userVidSource: window.URL.createObjectURL(mediaStream)})
    }

    render () {
        return (
            <div>
                <h1> This is the main </h1>

                <VideoFeed videoSource={this.state.userVidSource}/>
            </div>
        )
    }
}