// import React, {Component} from 'react';
// import {checkDiff} from '../videoUtils/motionSensing.js'

// export default class videoCanvas extends Component{
//   constructor(props){
//     super(props)
//     this.state = {
//       video : "",
//       context : {}
//     }
//     this.handleFill = this.handleFill.bind(this);
//   }
//   handleFill(){
//     this.state.context && this.state.video && this.state.context.drawImage( this.state.video, 0, 0, videoCanvas.width, videoCanvas.height );
//     this.state.context.fillStyle = this.state.context? '#FFFFFF' : null;
//     this.state.context &&  this.state.context.fillRect( 20, 20, videoCanvas.width, videoCanvas.height );
//   }
//   componentDidMount(){
//     let videoCC = this.videoCanvas.getContext('2d')
//     this.setState({context: videoCC})
  
//   }

//   componentWillReceiveProps(nextProps){
//     this.setState({video: nextProps.videoFeed})
//     console.log('from CWRP ', this.state)
//   }

//   componentDidUpdate(){
//     console.log('FROM CDU',this.state)
//     this.state.video.onplay = () =>{
//     this.state.context.drawImage( this.state.video, 0, 0, videoCanvas.width, videoCanvas.height );
//     this.state.context.fillStyle = '#FFFFFF'
//     this.state.context.fillRect( 20, 20, videoCanvas.width, videoCanvas.height );
//     }
//   }

//   render(){
//     console.log('FROM RENDER ' ,this.state)

//     return(
//       <canvas id="videoCanvas" ref={(canvas)=> this.videoCanvas = canvas} height="480px" width="640px" onClick={this.handleFill}></canvas>
//     )
//   }
// }