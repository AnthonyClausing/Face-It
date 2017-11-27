import React from 'react';
import getUserMedia from 'getusermedia';
import emotionClassifier from './models/emotionclassifier.js';
import emotionModel from './models/emotionmodel.js';
import pModel from './models/pmodel.js';
import clm from '../../public/ClamTracker/build/clmtrackr.js';
import _ from 'lodash';
import PubSub from 'pubsub-js';
import store from '../store/index.js';
import {connect} from 'react-redux';
import {setCoins, incrementScore} from '../store/round.js';

const coinCoords = [{x:0, y:0}, {x:300, y:0}, {x:568, y:0}, {x:0, y:230}, {x:568, y:230}, {x:0, y:450}, {x:568, y:450}]

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

	constructor(props) {
		super(props);

		this.PubSub = props.PubSub || PubSub;
		this.blend = this.blend.bind(this);
		this.lastImageData;
		this.checkAreas = this.checkAreas.bind(this);
		this.state = {}
	
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
		this.setState({tracker: ctrack});

		this.blendedCtx = this.blended.getContext('2d');
		this.canvasCtx = this.canvas.getContext('2d');
		this.canvasCtx.translate(this.canvas.width, 0);
		this.canvasCtx.scale(-1, 1);

		let self = this;

		this.video.addEventListener('canplay', (this.startVideo).bind(this), false);
	}
	
	getUserMediaCallback(err, stream ) {
		this.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
		this.video.play();
	}

	startVideo(){
		//seems to work fine without calling play
//		this.video.play();
		this.state.tracker.start(this.video);
		
		//this.ctrack.start(this.video);
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
		let coinArr = this.props.coinPositions.split('');
		let newPositions = '';
		for (var r=0; r<coinArr.length; ++r) {
			//get the pixels in a button area from the blended image
			var blendedData = this.blendedCtx.getImageData(
				coinCoords[coinArr[r]].x,
				coinCoords[coinArr[r]].y,
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
			// calculate an average between the color values of the note area
			average = Math.round(average / (blendedData.data.length / 4));
			if (average > 10) {
				// over a small limit, consider that a movement is detected
				// do some action to indicated area touched

				newPositions = this.props.coinPositions.slice(0,this.props.coinPositions.indexOf(r)) + this.props.coinPositions.slice(this.props.coinPositions.indexOf(r));
				console.log(newPositions)
				this.props.setCoins(newPositions);
				this.props.incrementScore();
				console.log('detected');				
			}
		}
	}

	drawLoop(){
		requestAnimationFrame((this.drawLoop).bind(this));
    
		//let cp = this.ctrack.getCurrentParameters();
		let cp = this.state.tracker.getCurrentParameters();

		this.canvasCtx.clearRect(0, 0, 600, 480);
		this.canvasCtx.drawImage(this.video, 0, 0, this.video.width, this.video.height);

		//only run the motion detection functions if the game is active
		if (this.props.gameState === 'active'){
			this.blend();
			this.checkAreas();
		}

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
		if(er) {
			document.getElementById('angry').innerHTML = '<span> Anger </span>' + er[0].value;
			document.getElementById('happy').innerHTML = '<span> Happy </span>' + er[3].value;
			document.getElementById('sad').innerHTML = '<span> Sad </span>' + er[1].value;
			document.getElementById('surprised').innerHTML = '<span> Surprised </span>' + er[2].value;
		}
       
		if (er) {
			const emotion = _.maxBy(er, (o) => { return o.value; });
			// this.setState({ emotion: emotion });
			this.PubSub.publish('emotions.loop', er);
		}
	}

	render() {
		console.log("*****", this.props)
		return (
			<div className="the-video">
				<div id='canvasAndButtons'>
					<canvas id='canvas-source'
						height='480px' width='600px'
						ref={ (canvas) => this.canvas = canvas }>
					</canvas>
					<div id='virtualButtons'>
						{	
							this.props.coinPositions.split('').map((position,index) => {
								let coinStyles = {
									position: 'absolute',
									height: '32px',
									width: '32px',
									top: coinCoords[position].y,
									left: coinCoords[position].x
								}
								return (
									<img src='/images/coin.gif' style={coinStyles}
									key={index} />
								)
							})
						}
					</div>
				</div>

				<video
					className = 'video-canvas'
					height='480px' width='600px'
					ref={ (video) => { this.video = video } } >
				</video>


				<canvas id='blended'
					height='480px' width='600px'
					ref={ (canvas) => this.blended = canvas}>
				</canvas>

			</div>
		)
	}
}

const mapStateToProps = state => {
    return {
		coinPositions: state.roundReducer.coinPositions,
		numberOfCoins: state.roundReducer.numberOfCoins,
		gameState: state.roundReducer.gameState
    }
}

const mapDispatchToProps = dispatch => {
	return {
		setCoins: (positions) => {
			dispatch(setCoins(positions))
		},
		incrementScore: () => {
			dispatch(incrementScore())
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoFeed);