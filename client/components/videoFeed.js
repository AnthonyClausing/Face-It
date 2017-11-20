import React, {Component} from 'react';

export default class VideoFeed extends Component {
    constructor () {
        super ();
    }


    render () {
        return (           
            <div>
                <h1> This is a video feed </h1>
                <video src={this.props.videoSource} className='videoInput' autoPlay='true'
                ref = {(video) => {this.video = video}}
                ></video>
            </div>
        )
    }
}