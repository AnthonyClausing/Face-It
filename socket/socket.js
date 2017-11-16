module.exports = io => {
    io.on('connection', socket => {
        console.log('Hooked up!', socket.id)
        socket.on('disconnect', function() {
            console.log('Severed the line. . .')
        })
    });
}