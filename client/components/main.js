import React, {Component} from 'react';
import Board from './board';
import Cell from './cell';
import Controls from './controls';

export default class Main extends Component {
    constructor () {
        super ();
    }

    render () {
        return (
            <div>
                <h1> This is the main </h1>
            </div>
        )
    }
}