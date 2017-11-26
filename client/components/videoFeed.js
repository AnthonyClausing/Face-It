import React, {Component} from 'react';

export default class VideoFeed extends Component {
    constructor () {
        super ();
    }


    render () {
        console.log('PROPS!!!!!!!!!!',this.props)
        return (           
            <div>
                <video id={this.props.id} src={this.props.videoSource} className='videoInput' autoPlay='true'
                ref = {(video) => {this.video = video}}
                ></video>
                <video id={this.props.id} src={this.props.remoteVidSource} className='videoInput' autoPlay='true'></video>
            </div>
        )
    }
}