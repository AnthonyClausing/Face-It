import React, {Component} from 'react';
import buildDraw from '../drawScript.js'

export default class VideoFeed extends Component {
    constructor () {
        super ();
    }

    componentDidMount () {
        //buildDraw();
    }

    render () {
        console.log(this.props);
        return (
            
            <div>
                <h1> This is a video feed </h1>
                <canvas id='drawCanvas' width='400' height='300'></canvas>
                <video src={this.props.videoSource} className='videoInput' autoPlay='true'>

                </video>
            </div>
        )
    }
}