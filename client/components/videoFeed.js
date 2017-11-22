import React from 'react';
import getUserMedia from 'getusermedia';
import emotionClassifier from './models/emotionclassifier.js';
import emotionModel from './models/emotionmodel.js';
import pModel from './models/pmodel.js';
import clm from '../ClamTracker/build/clmtrackr.js';
import _ from 'lodash';
import PubSub from 'pubsub-js';
function fastAbs (value) {
	return (value ^ (value >> 31)) - (value >> 31);
}

//  Cross-Browser Implementierung von der URL-Funktion, eher unwichtig
window.URL = window.URL ||
window.webkitURL ||
window.msURL ||
window.mozURL;

class VideoFeed extends React.Component {
	state = {
		emotion: { emotion: '' }
	}

	constructor(props) {
		super(props);

		this.PubSub = props.PubSub || PubSub;
	}

	componentDidMount() {
		let ec = new emotionClassifier();
		ec.init(emotionModel);
		let emotionData = ec.getBlank();
		this.ec = ec;

		getUserMedia({ video : true}, this.getUserMediaCallback.bind(this) );

		let ctrack = new clm.tracker({useWebGL : true});
		ctrack.init(pModel);
		this.ctrack = ctrack;

		this.blendedCtx = this.blended.getContext('2d');
		this.canvasCtx = this.canvas.getContext('2d');

		let self = this;

		this.video.addEventListener('canplay', (this.startVideo).bind(this), false);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.state.emotion.emotion !== nextState.emotion.emotion) {
			this.PubSub.publish('emotion.update', nextState.emotion);

			return true;
		}

		return false;
	}

	getUserMediaCallback(err, stream ) {
		this.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;

		this.video.play();
	}

	startVideo(){
		//seems to work fine without calling play
//		this.video.play();
		this.ctrack.start(this.video);
		// start loop to draw face
		this.drawLoop();
	}

	blend() {
		var width = canvasSource.width;
		var height = canvasSource.height;
		// get webcam image data
		var sourceData = contextSource.getImageData(0, 0, width, height);
		// create an image if the previous image doesn’t exist
		if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height);
		// create a ImageData instance to receive the blended result
		var blendedData = contextSource.createImageData(width, height);
		// blend the 2 images
		differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
		// draw the result in a canvas
		contextBlended.putImageData(blendedData, 0, 0);
		// store the current webcam image
		lastImageData = sourceData;
	}

	drawLoop(){
		requestAnimationFrame((this.drawLoop).bind(this));
    
		let cp = this.ctrack.getCurrentParameters();

		this.canvasCtx.clearRect(0, 0, 400, 300);
		this.canvasCtx.drawImage(this.video, 0, 0, this.video.width, this.video.height);

		//this draws the wire face image on the canvas
		// if (this.ctrack.getCurrentPosition()) {
		// 	this.ctrack.draw(this.overlay);
		// }

		// Die Emotionen in darstellbare Form bringen
		let er = this.ec.meanPredict(cp);
		if (this.props.target === 'angry' && er[0].value > .5) {
			this.props.matchedEmotion();
		} else if (this.props.target === 'happy' && er[3].value > .5) {
			this.props.matchedEmotion();
		} else if (this.props.target === 'sad' && er[1].value > .5) {
			this.props.matchedEmotion();
		} else if (this.props.target === 'surprised' && er[2].value > .5) {
			this.props.matchedEmotion();
		}
		
        document.getElementById('angry').innerHTML = '<span> Anger </span>' + er[0].value;
        document.getElementById('happy').innerHTML = '<span> Happy </span>' + er[3].value;
        document.getElementById('sad').innerHTML = '<span> Sad </span>' + er[1].value;
        document.getElementById('surprised').innerHTML = '<span> Surprised </span>' + er[2].value;

		if (er) {
			const emotion = _.maxBy(er, (o) => { return o.value; });
			this.setState({ emotion: emotion });
			this.PubSub.publish('emotions.loop', er);
		}

	}

	render(props) {
		return (
			<div className="the-video">
				<video
					width="400"
					height="300"
					ref={ (video) => { this.video = video } } >
				</video>

				<canvas id='canvas-source'
					width="400"
					height="300"
					ref={ (canvas) => this.canvas = canvas }>
				</canvas>

				<canvas id='blended'
					width="400"
					height="300"
					ref={ (canvas) => this.blended = canvas}>
				</canvas>

			</div>
		)
	}
}

module.exports = VideoFeed;

//window.ReactFacialFeatureTracker = ReactFacialFeatureTracker;
