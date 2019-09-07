const express = require('../node_modules/express');
const cors = require('../node_modules/cors');
const bodyParser = require("../node_modules/body-parser");
const mongoose = require("../node_modules/mongoose");
const upload = require('./upload');
// DB Models
const MaterialList = require("./models/list");

const server = express();
const port = process.env.PORT || 8000;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

// Connect DB
mongoose.connect('mongodb://localhost/fstnl-bom-mngr', { useNewUrlParser: true });

// Set server options
server.use(cors(corsOptions));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

// Set routes
server.get('/', (req, res) => {
    res.send(200, "connected");
});
server.post('/api/upload/', upload);
server.get('/api/lists', (req, res, next) => {
    MaterialList.find((err, data) => {
        if (err) return console.error(err);
        res.send(data);
    });
});
server.get('/api/lists/:id', (req, res, next) => {
    const q = req.params.id;

    MaterialList.findOne({id: q}, (err, data) => {
        if (err) return console.error(err);
        console.log(data.id);
        res.send(data);
    });
});
server.delete('/api/lists/:id', (req, res, next) => {
    const q = req.params.id;

    MaterialList.findOneAndDelete({id: q}, (err) => {
        if (err) return console.error(err);
        console.log(q + ' deleted.');
        res.sendStatus(204);
    });
});
server.put('/api/lists/:id', (req, res, next) => {
    const q = req.params.id,
        body = req.body;

    MaterialList.FindOneAndUpdate({id: q}, req.body, (err) => {
        res.send(200);
    });
});
server.post('/api/lists', (req, res, next) => {
    const dbModel = new MaterialList(data);
    
    res.send(201, dbModel);
});

/**
 * Just for testing
 */
server.get('/api/purge', (req, res, next) => {
    MaterialList.deleteMany({}, (err) => {
        if (err) { console.error(err); }
    });
    res.send(204, "DB purged");
});

// Open Server Connection
server.listen(port, () => {
    console.log(`server started @Port:${port}`);
});


 