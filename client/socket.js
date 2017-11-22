import io from 'socket.io-client';

function connectToSite (roomTaken) {
    const socket = io(window.location.origin)

    socket.on('connect', () => {
        console.log('Connected!, My Socket Id:', socket.id)
    })

    socket.on('roomTaken', (msg) => {
        console.log(msg);
        roomTaken(msg);
    })

    return socket;
}

function joinRoom (socket, roomName) {
    console.log('joing Room')
    socket.emit('joinRoom', roomName)
}

function newRoom (socket, roomName) {
    socket.emit('newRoom', roomName, socket.id)
}

module.exports = {
    connectToSite, joinRoom, newRoom
}