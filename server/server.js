const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const config = require('./config.json');
const { IamTokenManager } = require('ibm-watson/auth');

const PORT = config.port;

const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

io.on('connection', socket => {
    console.info(`socket-${socket.id}  connected`);
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
    })
});

const sttAuthenticator = new IamTokenManager({
    apikey: config.sttApiKey
});

//refer to https://github.com/watson-developer-cloud/speech-javascript-sdk/tree/master/examples/
app.get('/api/stt/token', (req, res) => {
    return sttAuthenticator
    .requestToken()
    .then(({ result }) => {
      res.json({ accessToken: result.access_token, url: config.sttUrl });
    })
    .catch(console.error);
});

server.listen(PORT, () => {
    console.log('server is up and running on ' + PORT);
});

