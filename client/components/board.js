import React, {Component} from 'react';

export default class Board extends Component {
    constructor () {
        super ();
    }

    render () {
        return (
            <div>
                <div id='angles'></div>
                <div id='gameControls'>
                    <div id='stopGame' onclick='stopGame()'></div>
                    <div id='startGame' onclick='startGame()'></div>
                </div>
                <div id='values'></div>
                <div id='relative'></div>
                <div id='message'></div>
                <div id='board'>
                    <div class="row">
                        <div class='box' data-position='1'>
                        </div><div class='box' data-position='2'>
                        </div><div class='box' data-position='3'>
                        </div><div class='box' data-position='4'>
                        </div><div class='box' data-position='5'>
                        </div>
                    </div>
                    <div class="row">
                        <div class='box' data-position='6'>
                        </div><div class='box' data-position='7'>
                        </div><div class='box' data-position='8'>
                        </div><div class='box' data-position='9'>
                        </div><div class='box' data-position='10'>
                        </div>
                        </div>
                    <div class="row">
                        <div class='box' data-position='11'>
                        </div><div class='box' data-position='12'>
                        </div><div class='box' data-position='13'>
                        </div><div class='box' data-position='14'>
                        </div><div class='box' data-position='15'>
                        </div>
                        </div>
                    <div class="row">
                        <div class='box' data-position='16'>
                        </div><div class='box' data-position='17'>
                        </div><div class='box' data-position='18'>
                        </div><div class='box' data-position='19'>
                        </div><div class='box' data-position='20'>
                        </div>
                    </div>
                    <div class="row">
                        <div class='box' data-position='21'>
                        </div><div class='box' data-position='22'>
                        </div><div class='box' data-position='23'>
                        </div><div class='box' data-position='24'>
                        </div><div class='box' data-position='25'>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}