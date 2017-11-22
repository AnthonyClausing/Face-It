import React, {Component} from 'react';
import {checkHotSpots} from '../videoUtils/motionSensing.js'


export default class blendCanvas extends Component{
  constructor(props){
    super(props)
    this.state = {
      context : {}
    }
  }

  componentDidMount(){
    let blendedContext = this.blendedCanvas.getContext('2d')
    this.setState({context: blendedContext});
    checkHotSpots(blendedContext)
    
  }


  


  render(){
        return(<canvas id="blendCanvas" ref={(blendedCanvas)=> this.blendedCanvas = blendedCanvas} height="480px" width="640px"></canvas>)
  }

}  