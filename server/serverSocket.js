
module.exports = io => {
    io.on('connection', socket => {
        console.log('Hooked up!', socket.id)
        socket.on('disconnect', function() {
            console.log('Severed the line. . .')
        })

        socket.on('newRoom', (roomName, roomCreator) => {
            if (!io.nsps['/'].adapter.rooms.hasOwnProperty(roomName)){
                socket.join(roomName);
            } else {
                io.to(roomCreator).emit('roomTaken', roomName + ' is taken.')
                console.log('room already in use')
            }
        })

        socket.on('joinRoom', (roomName) => {
            console.log('rooms', io.nsps['/'].adapter.rooms)
            if (io.nsps['/'].adapter.rooms.hasOwnProperty(roomName)){
                console.log('rooms exists')
                socket.join(roomName);
            } else {
                console.log('room not found')
            } 
        })
    });
}