const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const config = require('./config.json');

const PORT = config.port;

const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(cors());

io.on('connection', socket => {
    console.log('socket connected');
});

//refer to https://github.com/watson-developer-cloud/speech-javascript-sdk/tree/master/examples/
app.get('/', (req, res) => {
    res.json('hello world');
});

server.listen(PORT, () => {
    console.log('server is up and running on ' + PORT);
});

