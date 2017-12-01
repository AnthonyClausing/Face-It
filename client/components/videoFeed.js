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
import {setNumberCoins, setCoins, incrementScore, toggleCanvasClass, incrementCoins} from '../store/round.js';

const coinCoords = [{x:0, y:0}, {x:300, y:0}, {x:568, y:0}, {x:0, y:230}, {x:568, y:230}, {x:0, y:450}, {x:568, y:450}]

const audio = new Audio('coin.WAV');

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

function pickPositions(num) {
	let positions = '';
	let possiblePositions = [0, 1, 2, 3, 4, 5, 6];
	for (let i = 0; i < num; i++) {
		positions += (possiblePositions.splice(Math.floor(Math.random() * possiblePositions.length), 1)[0]);
	}
	return positions;
}

//  Cross-Browser Implementierung von der URL-Funktion, eher unwichtig
// window.URL = window.URL ||
// window.webkitURL ||
// window.msURL ||
// window.mozURL;

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

		// getUserMedia({ video : true}, this.getUserMediaCallback.bind(this) );

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
	updateScore(score,user,roomName) {
		console.log('******SCORE:', score, user);
		socket.emit('updateScore', {score, user, roomName} )
		this.props.incrementScore();
	}
	checkAreas() {
		// loop over the coin areas
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
			// over a small limit, consider that a movement is detected
			if (average > 10) {
				// slice out the touched coin from the positions
				newPositions = this.props.coinPositions.slice(0,this.props.coinPositions.indexOf(coinArr[r])) + this.props.coinPositions.slice(this.props.coinPositions.indexOf(coinArr[r])+1);
				//if they have gotten all the coins, make more appear, up until 7
				if (newPositions.length === 0){
					if (this.props.numberOfCoins < 7) {
						this.props.setNumberCoins(this.props.numberOfCoins + 1)
					}
					newPositions = pickPositions(this.props.numberOfCoins);
				}
				//update the coin positions in the store
				this.props.setCoins(newPositions);
				//update score
				this.updateScore(this.props.score+1,this.props.user, this.props.roomName)
				//play an audio cue
				audio.pause();
				audio.currentTime = 0;	
				audio.play();		
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
			if (this.props.matching){
				this.checkAreas();
			}
		}

		// gauging which emotion is dominant
		let er = this.ec.meanPredict(cp);
		switch (this.props.targetEmotion) {
			case 'angry':
				if ((er[0].value > .3 && !this.props.matching) || (er[0].value < .3 && this.props.matching)) {
					this.props.toggleCanvasClass();
				}
				break;
			case 'happy':
				if ((er[3].value > .5 && !this.props.matching) || (er[3].value < .5 && this.props.matching)) {
					console.log('togglehappy');
					this.props.toggleCanvasClass();
				}
				break;
			case 'sad':
				if ((er[1].value > .5 && !this.props.matching) || (er[1].value < .5 && this.props.matching)) {
					this.props.toggleCanvasClass();
				}
				break;
			case 'surprised':
				if ((er[2].value > .5 && !this.props.matching) || (er[2].value < .5 && this.props.matching)) {
					this.props.toggleCanvasClass();
				}
				break;
		}

		// if(er) {
		// 	//these are just for development purposes, easy read out of status
			// document.getElementById('angry').innerHTML = '<span> Anger </span>' + er[0].value;
			// document.getElementById('happy').innerHTML = '<span> Happy </span>' + er[3].value;
			// document.getElementById('sad').innerHTML = '<span> Sad </span>' + er[1].value;
			// document.getElementById('surprised').innerHTML = '<span> Surprised </span>' + er[2].value;
		// }
       
	}

	render(props) {
		let className = this.props.matching?'matching':'notMatching';
		console.log(window.location.pathname)
		return (
			<div className='player-video'>
				{
					<div className='vid-size'>

						<div>Your score
							{this.props.score}
						</div>
						<div id='p1canvasAndButtons'>
							<canvas id='p1canvas-source'
								width='600px' height='480px'
								ref={(canvas) => this.canvas = canvas}
								className={className}>
							</canvas>
							<div id='p1virtualButtons'>
								{
									this.props.coinPositions.split('').map((position, index) => {
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
							{this.props.blackout && 
								<div id='blackOut'></div>
							}
						</div>
			
						<video
							className = 'video-canvas'
							width="600"
							height="480"
							id={this.props.id}
							src={this.props.videoSource}
							autoPlay="true"
							muted
							ref={(video) => { this.video = video }}>
						</video>
					</div>
			}
				<div>{this.props.targetEmotion}</div>
				<canvas className='blended'
					width='600px' height='480px'
					ref={(canvas) => this.blended = canvas}>
				</canvas>
			</div>
		)
	}
}

const mapStateToProps = state => {
    return {
		coinPositions: state.roundReducer.coinPositions,
		numberOfCoins: state.roundReducer.numberOfCoins,
		gameState: state.roundReducer.gameState,
		targetEmotion: state.roundReducer.targetEmotion,
		matching: state.roundReducer.matching,
		score: state.roundReducer.score,
		opponentScore: state.roundReducer.opponentScore,
		opponentCoinPositions: state.roundReducer.opponentCoinPositions,
		user: state.user.userName,
		blackout: state.roundReducer.blackout
    }
}

const mapDispatchToProps = dispatch => {
	return {
		setCoins: (positions) => {
			dispatch(setCoins(positions))
		},
		incrementScore: () => {
			dispatch(incrementScore())
		},
		toggleCanvasClass: () => {
			dispatch(toggleCanvasClass())
		},
		setNumberCoins: (num) => {
			dispatch(setNumberCoins(num))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoFeed);



// <div id='p2virtualButtons'>
// {
// 	this.props.coinPositions.split('').map((position, index) => {
// 		let coinStyles = {
// 			position: 'absolute',
// 			height: '32px',
// 			width: '32px',
// 			top: coinCoords[position].y,
// 			left: coinCoords[position].x
// 		}
// 		return (
// 			<img src='/images/coin.gif' style={coinStyles}
// 				key={index} />
// 		)
// 	})
// }
// </div>