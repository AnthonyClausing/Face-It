import React, {Component} from 'react';
import buildDraw from '../drawScript.js'

export default class VideoFeed extends Component {
    constructor () {
        super ();
    }

    componentDidMount () {
        this.canvasInput = document.getElementById('drawCanvas');
        let cc = this.canvasInput.getContext('2d');
        let ec = new emotionClassifier();
        ec.init(emotionModel);
        let emotionData = ec.getBlank();

        let ctracker = new clm.tracker({useWebGL: true});
        ctracker.init(pModel);

        this.ctracker = ctracker;
        this.ec = ec;
        this.cc = cc;
        this.drawLoop = this.drawLoop.bind(this);
    }

    componentDidUpdate () {
        this.ctracker.start(this.video)
        this.drawLoop();
    }

    startVideo () {
        console.log('starting');
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true, audio: true}, this.ctracker.start(media), error);
        }
        this.ctracker.start()
        this.drawLoop();
    }

    drawLoop () {
        requestAnimationFrame(this.drawLoop);
        this.cc.clearRect(0, 0, this.canvasInput.width, this.canvasInput.height);
        this.ctracker.draw(this.canvasInput);

        let cp = this.ctracker.getCurrentParameters();
        let er = this.ec.meanPredict(cp);
        console.log(cp);
    }

    render () {
        return (
            
            <div>
                <h1> This is a video feed </h1>
                <canvas id='drawCanvas' width='400' height='300'></canvas>
                <video src={this.props.videoSource} className='videoInput' autoPlay='true'
                ref = {(video) => {this.video = video}}
                ></video>
            </div>
        )
    }
}