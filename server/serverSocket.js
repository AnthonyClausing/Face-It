
module.exports = io => {
    io.on('connection', socket => {
        console.log('Hooked up!', socket.id);
        socket.on('disconnect', function() {
            console.log('Severed the line. . .');
        });

        socket.on('newRoom', (roomName, roomCreator) => {
            if (!io.nsps['/'].adapter.rooms.hasOwnProperty(roomName)){
                socket.join(roomName);
                console.log(io.nsps['/'].adapter.rooms[roomName].length)
            } else {
                io.to(roomCreator).emit('roomTaken', roomName + ' is taken.');
                console.log('room already in use');
            }
        });

        //changed things here
        socket.on('joinRoom', (roomName) => {
            console.log('rooms', io.nsps['/'].adapter.rooms);
            if (io.nsps['/'].adapter.rooms.hasOwnProperty(roomName)){
                console.log('rooms exists');
                console.log(io.nsps['/'].adapter.rooms[roomName])
                if(io.nsps['/'].adapter.rooms[roomName].length < 2){
                socket.join(roomName);
                socket.broadcast.to(roomName).emit('someoneJoinedTheRoom');}
                else{socket.emit('roomTaken', `room ${roomName} is full`)}
            } else {
                socket.emit('roomTaken', `room ${roomName} doesn't exist`)
                console.log('room not found');
            }
        });
        socket.on('startGame', (roomName, rounds) => {
            socket.broadcast.to(roomName).emit('startGame', rounds);
        })

        socket.on('ready', (roomName) => {
            socket.broadcast.to(roomName).emit('opponentReady')
        })

        socket.on('updateScore', ({user,score,roomName}) =>{
            console.log('score update', score, user)
            socket.broadcast.to(roomName).emit('opponentScored', {user,score})
        })
        
        //changed things here
        socket.on('blackoutOpponent', (roomName) => {
            console.log('blaking out');
            socket.broadcast.to(roomName).emit('blackoutScreen');
        })

        socket.on('newEmotion', (emotion, roomName) => {
            console.log('newEmotion');
            socket.broadcast.to(roomName).emit('opponentEmotion', emotion)
        })
    
        //changed things here
        socket.on('signal', (message, roomName) => {
            console.log("signal!!!! ", roomName, message)
            socket.broadcast.to(roomName).emit('signal', message);
            // socket.broadcast.emit('signal', message);
        });
    });
};
