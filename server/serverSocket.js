
module.exports = io => {
    io.on('connection', socket => {
        console.log('Hooked up!', socket.id)
        socket.on('disconnect', function() {
            console.log('Severed the line. . .')
        })

        socket.on('newRoom', (roomName, roomCreator) => {
            if (!io.nsps['/'].adapter.rooms.hasOwnProperty(roomName)){
                socket.join(roomName);
                io.nsps['/'].adapter.rooms[roomName].owner = roomCreator;
                console.log(roomName, roomCreator);
            } else {
                io.to(roomCreator).emit('roomTaken', roomName + ' is taken.')
                console.log('room already in use')
            }
        })

        socket.on('joinRoom', roomName => {
            console.log('rooms', io.nsps['/'].adapter.rooms)
            if (io.nsps['/'].adapter.rooms.hasOwnProperty(roomName)){
                console.log('rooms exists')
                socket.join(roomName);
                socket.broadcast.to(roomName).emit('someoneJoinedTheRoom');
            } else {
                console.log('room not found')
            } 
        })

        socket.on('signal', message => {
            socket.broadcast.emit('signal', message)
        })

    });
}