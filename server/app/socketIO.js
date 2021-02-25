function socketIO (server) {
    const io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', socket => {
        console.info(`WEBSOCKET CONNECTED - socket-${socket.id}`);
        const video = sAudio = mAudio = [];
        socket['buffers'] = {video, sAudio, mAudio};
    
        socket.on('data', data => {
            const [type, buffer] = Object.entries(data)[0];
            socket['buffers'][type].push(buffer);
        });
    
        socket.on('disconnect', () => {
            for (const bufferArray of Object.values(socket['buffers'])) {
                const buffer = Buffer.concat(bufferArray);
    
                //save buffer into DB
            }
    
            socket.disconnect();
            console.info(`WEBSOCKET DISCONNECTED - socket-${socket.id}`);
        })
    });
}

module.exports = socketIO;