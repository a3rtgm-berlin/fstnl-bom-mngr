const express = require('../node_modules/express');
const cors = require('../node_modules/cors');
const upload = require('./upload');

const server = express();
const port = process.env.PORT || 8000;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

server.use(cors(corsOptions));
server.get('/', (req, res) => {
    res.send("connected");
});
server.post('/upload/', upload);


server.listen(port, () => {
    console.log(`server started @Port:${port}`);
});
 