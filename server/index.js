const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const session = require('session');
const socketio = require('socket.io');
const morgan = require('morgan');

const port = process.env.PORT || 3000;
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '..', '/public')))

app.get('*', function (req, res, next) {
    res.status(200).send('../public/index.html');
})


const server = app.listen(port, () => console.log('Facing It'));
const io = socketio(server);

require('../socket/socket.js')(io);