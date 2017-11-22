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

function differenceAccuracy(target, data1, data2) {
	if (data1.length != data2.length) return null;
	var i = 0;
	while (i < (data1.length * 0.25)) {
		var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
		var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
		var diff = threshold(fastAbs(average1 - average2));
		target[4*i] = diff;
		target[4*i+1] = diff;
		target[4*i+2] = diff;
		target[4*i+3] = 0xFF;
		++i;
	}
}

function threshold(value) {
	return (value > 0x15) ? 0xFF : 0;
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
		this.blend = this.blend.bind(this);
		this.lastImageData;
		this.virtualButtonPositions = [{color:'blue', x:0, y:0}, {color: 'red', x:32, y:0}]
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
		var width = this.canvas.width;
		var height = this.canvas.height;
		// get webcam image data
		var sourceData = this.canvasCtx.getImageData(0, 0, width, height);
		// create an image if the previous image doesn’t exist
		if (!this.lastImageData) this.lastImageData = this.canvasCtx.getImageData(0, 0, width, height);
		// create a ImageData instance to receive the blended result
		var blendedData = this.canvasCtx.createImageData(width, height);
		// blend the 2 images
		differenceAccuracy(blendedData.data, sourceData.data, this.lastImageData.data);
		// draw the result in a canvas
		this.blendedCtx.putImageData(blendedData, 0, 0);
		// store the current webcam image
		this.lastImageData = sourceData;
	}

	checkAreas() {
		// loop over the button areas
		for (var r=0; r<this.virtualButtonPositions.length; ++r) {
			// get the pixels in a button area from the blended image
			var blendedData = this.blendedCtx.getImageData(
				this.virtualButtonPositions[r].x,
				this.virtualButtonPositions[r].y,
				32,
				32
			);
			var i = 0;
			var average = 0;
			// loop over the pixels
			while (i < (blendedData.data.length / 4)) {
				// make an average between the color channel
				average += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
				++i;
			}
			// calculate an average between of the color values of the note area
			average = Math.round(average / (blendedData.data.length / 4));
			if (average > 10) {
				// over a small limit, consider that a movement is detected
				// do some action to indicated area touched
				this.props.matchedEmotion();
				console.log('detected');
				document.getElementById(this.virtualButtonPositions[r].color + 'Button').style.cssText = "border: 3px solid yellow";
			}
		}
	}

	drawLoop(){
		requestAnimationFrame((this.drawLoop).bind(this));
    
		let cp = this.ctrack.getCurrentParameters();

		this.canvasCtx.clearRect(0, 0, 400, 300);
		this.canvasCtx.drawImage(this.video, 0, 0, this.video.width, this.video.height);
		this.blend();
		this.checkAreas();

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

				<div id='virtualButtons'>
					<img id='blueButton' src="/images/SquareBlue.png" />
					<img id='redButton' src="/images/SquareRed.png" />
				</div>

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
