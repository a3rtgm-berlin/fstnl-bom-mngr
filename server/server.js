const config = require('./config');
const express = require('../node_modules/express');
const cors = require('../node_modules/cors');
const bodyParser = require("../node_modules/body-parser");
const mongoose = require("../node_modules/mongoose");
const upload = require('./upload');
const projectHandler = require('./projectsHandler');

// Classes
const Comparison = require('./compareLists');

// DB Models
const MaterialList = require("./models/list").MaterialListModel;
const Project = require("./models/project").ProjectModel;

// Server
const server = express();
const port = process.env.PORT || 8000;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

// Connect DB
mongoose.connect('mongodb://a3rtgm:a#AT.987652a@91.250.112.78:27017/fstnl-bom-mngr', { useNewUrlParser: true });

// Set server options
server.use(cors(corsOptions));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

// Set routes
server.get('/', (req, res) => {
    res.send(200, "connected");
});

/**
 * @description Handles uploaded BOM files
 * @param {*} file the BOM file uploaded
 * @method POST
 * @returns {void}
 */
server.post('/api/upload/', upload);

/**
 * @description returns all uploaded BOM Lists
 * @todo ... for a selected project?
 * @returns {[MaterialList]}
 */
server.get('/api/lists', (req, res, next) => {
    MaterialList.find((err, data) => {
        if (err) return console.error(err);
        res.send(data);
    });
});

/**
 * @description returns one selected list by date
 * @todo ... and project
 * @returns {MaterialList}
 */
server.get('/api/lists/:id', (req, res, next) => {
    const q = req.params.id;

    MaterialList.findOne({id: q}, (err, data) => {
        if (err) return console.error(err);
        res.send(data);
    });
});

/**
 * @description deletes a list by date
 * @todo ... and project
 * @returns {void}
 */
server.delete('/api/lists/:id', (req, res, next) => {
    const q = req.params.id;

    MaterialList.findOneAndDelete({id: q}, (err) => {
        if (err) return console.error(err);
        console.log(q + ' deleted.');
        res.sendStatus(204);
    });
});

/**
 * @description overrides a list by date
 * @todo ... and project
 * @returns {void}
 */
server.put('/api/lists/:id', (req, res, next) => {
    const q = req.params.id,
        body = req.body;

    MaterialList.FindOneAndUpdate({id: q}, req.body, (err) => {
        res.send(200);
    });
});

/**
 * @description manually adds a list (not necessary?)
 */
server.post('/api/lists', (req, res, next) => {
    const dbModel = new MaterialList(data);
    
    res.send(201, dbModel);
});

/**
 * @description compares two lists from DB and returns the result
 * @param {string} id1
 * @param {string} id2
 * @returns {comparison}
 */
server.get('/api/lists/compare/:id1/:id2', (req, res, next) => {
    const q = req.params;
    let comparison;

    MaterialList.find({id: {$in: [q.id1, q.id2]}}, (err, data) => {
        if (err) return console.error(err);
        comparison = new Comparison(data);
        res.send(comparison);
    });
});

/**
 * @description adds a project by form data
 * @returns {void}
 */
server.post('/api/projects', projectHandler.newProject);

/**
 * @description returns all projects from DB
 * @returns {[Project]}
 */
server.get('/api/projects', (req, res, next) => {
    Project.find((err, data) => {
        if (err) return console.error(err);
        res.send(data);
    });
});

/**
 * @description returns a projects by name
 * @returns {Project}
 */
server.get('/api/projects/:name', (req, res, next) => {
    const q = req.params.name;

    Project.findOne({name: q}, (err, data) => {
        if (err) return console.error(err);
        res.send(data);
    });
});

/**
 * @description deletes project by name
 * @returns {void}
 */
server.delete('/api/projects/:name', (req, res, next) => {
    const q = req.params.name;

    if (q === 'delete-all') {
        Project.deleteMany({}, (err) => {
            if (err) return console.error(err);
            res.sendStatus(204);
        });
    } else {
        Project.findOneAndDelete({name: q}, (err) => {
            if (err) return console.error(err);
            console.log(q + ' deleted.');
            res.sendStatus(204);
        });
    }
});

// Open Server Connection
const handler = server.listen(port, () => {
    console.log(`server started @Port:${port}`);
});
handler.setTimeout(10000);


 