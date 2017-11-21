import React, {Component} from 'react';
import VideoCanvas from './videoCanvas';
import BlendCanvas from './blendCanvas';

export default class VideoFeed extends Component {
	constructor(props){
		super(props)
		this.state = {
			video :""
		}
	}
	componentDidMount(){
		//console.log(this.video)
		this.setState({video: this.video})
	}
	
	
	render() {	
		return (
			<div >
			<video ref={(video)=> this.video = video } src={this.props.videoOptions.src} autoPlay={this.props.videoOptions.autoplay} className="player-videos"></video>
			<VideoCanvas videoFeed={this.state.video} />
			<BlendCanvas  />
		</div>
		)
	}
}

//module.exports = ReactFacialFeatureTracker;

//window.ReactFacialFeatureTracker = ReactFacialFeatureTracker;



