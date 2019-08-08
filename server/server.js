const express = require('../node_modules/express');
const cors = require('../node_modules/cors');
const upload = require('./upload');

const server = express();
const port = process.env.PORT || 8000;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

server.listen(port, () => {
    console.log(`server started @Port:${port}`);
});

server.use(cors(corsOptions));

server.get('/', (req, res, next) => {
    res.status(200).end();
});
server.post('/upload', (req, res) => {
    res.send('u got post');
});
 