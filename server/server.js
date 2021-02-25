const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const config = require('./config.json');
const server = http.createServer(app);

app.use(cors());

require('./app/socketIO')(server);
require('./app/analysisApi')(app);

const PORT = config.port;
server.listen(PORT, () => {
    console.log('server is up and running on ' + PORT);
});

