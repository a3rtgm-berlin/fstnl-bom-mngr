'use strict';

const express = require('express');
const config = require('./config');
const cors = require('cors');
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
const mongoose = require("../node_modules/mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const http = require('http');

// Server Modules
const upload = require('./upload');
const projectHandler = require('./projectsHandler');
const createMaster = require('./createMaster');
const utils = require('./utils');

// Classes
const Comparison = require('./compareLists');
const MultiBom = require('./multiBom');

// DB Models
const MaterialList = require("./models/list").MaterialListModel;
const Project = require("./models/project").ProjectModel;
const MasterBom = require('./models/masterBom');
const User = require("./models/userModel").UserModel;
const ExcludeList = require("./models/excludeList");
const ArbMatrix = require("./models/arbMatrix");

// Constants
// const PORT = 8080;
// const HOST = '0.0.0.0';
const HOST = 'localhost';
const PORT = 8000;

// App
const app = express();

// CORS
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

// Expess Session
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport config
require('./passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
const privateKey = fs.readFileSync('./keys/private.key', 'utf8');
const publicKey = fs.readFileSync('./keys/public.key', 'utf8');

const signOptions = {
    expiresIn: '3h', //3 hours
    algorithm: 'HS512',
};
const verifyOptions = {
    expiresIn: '3h', //3 hours
    algorithms: ['HS512'],
};

// Connect Flash
app.use(flash());

//Global Variables 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Connect DB
mongoose.connect('mongodb://a3rtgm:a#AT.987652a@91.250.112.78:27017/fstnl-bom-mngr', { useNewUrlParser: true, 'useFindAndModify': false, 'useUnifiedTopology': true });
// mongoose.connect('mongodb://localhost:27017/fstnl-bom-mngr', { useNewUrlParser: true, 'useFindAndModify': false, 'useUnifiedTopology': true });

// Set server options
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set routes
app.get('/', (req, res) => {
    res.send(200, "connected");
});

app.get('/api/test/:id', (req, res) => {
    var id = req.params.id;
    console.log(id);

    MasterBom.findOne({id: {$lt: id}}).sort({id: -1}).exec(async (err, data) => {
        if (err) {
            res.sendStatus(404);
            return console.error(err);
        };
        if (data) {
            console.log(data.id);
            res.status(200).send(data);
        }
    });
});

/**
 * @description Handles upload of ArbMatrix files
 * @param {*} file
 * @method POST
 */
app.post('/api/upload/matrix', upload.matrix);
app.post('/api/upload/exclude', upload.excludeList);
app.get('/api/matrix', (req, res) => {
    ArbMatrix.find((err, data) => {
        if (err) {
            res.sendStatus(404);
            return console.error(err);
        }
        res.send(data[0]);
    });
});
app.get('/api/exclude', (req, res) => {
    ExcludeList.find((err, data) => {
        if (err) {
            res.sendStatus(404);
            return console.error(err);
        }
        res.send(data[0]);
    });
});

/**
 * @description Handles uploaded BOM files
 * @param {*} file the BOM file uploaded
 * @method POST
 * @returns {void}
 */
app.post('/api/upload/bom', upload.bom);

/**
 * @description todo
 * @param
 * @method
 */
app.get('/api/master/create/:id', createMaster);

/**
 * @description rebuilds the current master by ID
 * @param id the ID string of the current month
 * @method get
 */
app.get('/api/master/rebuild/:id', (req, res) => {
    const q = req.params.id;

    MasterBom.findOneAndDelete({id: q}, (err) => {
        if (err) {
            res.sendStatus(404);
            return console.error(err);
        }
        MaterialList.find({id: { $regex: q, $options: 'i' }}, (err, boms) => {
            utils.updateExcludesAndMatrix(boms).then(success => {
                if (success) {
                    createMaster(req, res);
                }
            });
        });
    });
});

/**
 * @description todo
 * @param
 * @method
 */
app.get('/api/master', (req, res) => {
    MasterBom.find((err, data) => {
        if (err) throw err;
        if (data) return res.status(200).send(
            [data.sort((a, b) => {
                if (a.id < b.id) return 1;
                return -1;
            })[0]]
        );
        res.sendStatus(404);
    });
});

/**
 * @description todo
 * @param
 * @method
 */
app.get('/api/master/id', (req, res) => {
    MasterBom.find((err, data) => {
        if (err) throw err;
        if (data.length > 0) return res.status(200).send(
            [data.map(d => d.id).sort((a, b) => {
                if (a < b) return 1;
                return -1;
            })[0]]
        );
        res.status(200).send(['0000-00']);
    });
});

/**
 * @description returns all created Master BOMs
 * @todo ... for a selected project?
 * @returns {[MaterialList]}
 */
app.get('/api/master/all', (req, res, next) => {
    MasterBom.find((err, data) => {
        if (err) return console.error(err);
        res.send(data);
    });
});

/**
 * @description returns one selected list by date
 * @todo ... and project
 * @returns {MaterialList}
 */
app.get('/api/master/get/:id', (req, res, next) => {
    const q = req.params.id;

    MasterBom.findOne({id: q}, (err, data) => {
        if (err) return console.error(err);
        res.send(data);
    });
});

/**
 * @description deletes a master by id
 * @todo ... and project
 * @returns {MaterialList}
 */
app.delete('/api/master/delete/:id', (req, res) => {
    const q = req.params.id;

    MasterBom.findOneAndDelete({id: q}, (err) => {
        if (err) {
            res.sendStatus(404)
            return console.error(err);
        }
        res.status(204).send('deleted');
    });
});

/**
 * @description returns all uploaded BOM Lists
 * @todo ... for a selected project?
 * @returns {[MaterialList]}
 */
app.get('/api/lists', (req, res, next) => {
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
app.get('/api/lists/:id', (req, res) => {
    const q = req.params.id;

    MaterialList.findOne({id: q}, (err, data) => {
        if (err) return console.error(err);
        res.send(data);
    });
});

/**
 * @description deletes a list by ID (Project + Date)
 * @todo ... and project
 * @returns {void}
 */
app.delete('/api/lists/:id', (req, res, next) => {
    const q = req.params.id;

    if (q === 'delete-all') {
        MaterialList.deleteMany({}, (err) => {
            if (err) return console.error(err);
            res.sendStatus(204);
        })
    } else {
        MaterialList.findOneAndDelete({id: q}, (err) => {
            if (err) return console.error(err);
            console.log(q + ' deleted.');
    
            Project.findOne({tag: q.slice(0, q.indexOf('-'))}, (err, data) => {
                if (err) return console.error(err);
                
                if (data) {
                    data.bomLists = data.bomLists.filter(id => id !== q);
                    data.save();
                }
            });
    
            res.sendStatus(204);
        });
    }
});

/**
 * @description returns all metas for the boms of a a project
 */
app.get('/api/project/meta/:tag', (req, res) => {
    const q = req.params.tag;

    MaterialList.find({project: q}, (err, boms) => {
        if (err) {
            res.sendStatus(500);
            return console.error(err);
        }
        const meta = boms.map(bom => {
            return {
                id: bom.id,
                name: bom.name,
                project: bom.project,
                date: bom.date,
                uploadDate: bom.uploadDate
            }
        });
        res.send(meta);
    });
});

/**
 * @description returns all metas for a single bom
 */
app.get('/api/lists/meta/:id', (req, res) => {
    const q = req.params.id;

    MaterialList.findOne({id: q}, (err, bom) => {
        if (err) {
            res.sendStatus(500);
            return console.error(err);
        }
        res.send({
            id: bom.id,
            name: bom.name,
            project: bom.project,
            date: bom.date,
            uploadDate: bom.uploadDate
        });
    });
});

/**
 * @description rebuilds a given project BOM file with the updated project values
 * @param {String} id the bom id
 * @returns {void}
 */
app.get('/api/lists/update/:id', (req, res) => {
    const q = req.params.id;

    MaterialList.findOne({id: q}, (err, bom) => {
        if (err) {
            res.sendStatus(404);
            return console.error(err);
        }
        utils.updatePartAmount(bom, res);
    });
});

/**
 * @description overrides a list by date
 * @todo ... and project
 * @returns {void}
 */
app.put('/api/lists/:id', (req, res, next) => {
    const q = req.params.id,
        body = req.body;

    MaterialList.findOneAndUpdate({id: q}, req.body, (err) => {
        res.send(200);
    });
});

app.post('/api/lists/multibom', (req, res) => {
    MaterialList.find({id: {$in: req.body.lists}}, (err, data) => {
        if (err) {
            res.send(503);
            return console.error(err);
        }

        if (data) {
            const multiBom = new MultiBom(data);
            const dbModel = new MaterialList(multiBom.list);
            dbModel.save((err) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
        
                Project.findOne({tag: multiBom.list.project}, (err, project) => {
                    if (err) throw err;
                    if (project) {
                        project.bomLists = project.bomLists.filter(id => !req.body.lists.includes(id));
                        project.bomLists.push(multiBom.list.id);
                        project.save();
                    }
                });
            });

            res.sendStatus(201);
        }
    });
});

app.post('/api/projects/:tag', (req, res, next) => {
    const q = req.params.tag

    Project.findOneAndUpdate({tag: q}, req.body, (err, data) => {
        if (err) {
            res.send(418);
        } else {
            res.sendStatus(200);
        }
    });
});

app.post('/api/token/verify', (req, res) => {
    if (req.body.token) {
        const decoded = jwt.verify(req.body.token, privateKey, verifyOptions, (err, decoded) => {
            if (err) return res.status(401).send(false);
            return res.status(200).send(true);
        });
    } else {
        return res.status(204).send(false);
    }
});

app.post('/api/users/authenticate', passport.authenticate('local', {
    successMessage: 'you are now logged in',
    failureMessage: 'something went wrong',
    failureFlash: true
}), (req, res) => {
    const token = jwt.sign({
        "admin": req.user.admin,
        "dev": req.user.dev,
    }, privateKey, {
        expiresIn: '3h',
        algorithm: 'HS512',
        header: {
            alg: "HS512",
            typ: "JWT"
        }
    });

    res.json({
        success: true,
        token: token,
        user: {
            id:req.user._id,
            username: req.user.username,
            email: req.user.email
        }
    })
});

/**
 * @description manually adds a list (not necessary?)
 */
app.post('/api/lists', (req, res, next) => {
    const dbModel = new MaterialList(data);
    
    res.send(201, dbModel);
});

/**
 * @description compares two lists from DB and returns the result
 * @param {string} id1
 * @param {string} id2
 * @returns {comparison}
 */
app.get('/api/master/compare/:id1/:id2', (req, res, next) => {
    const q = req.params;
    let comparison;

    MasterBom.find({id: {$in: [q.id1, q.id2]}}, (err, data) => {
        if (err) return console.error(err);
        comparison = new Comparison(data);
        res.send(comparison);
    });
});

/**
 * @description adds a project by form data
 * @returns {void}
 */
app.post('/api/projects', projectHandler.newProject);

/**
 * @description returns all projects from DB
 * @returns {[Project]}
 */
app.get('/api/projects', (req, res, next) => {
    Project.find((err, data) => {
        if (err) return console.error(err);
        res.send(data);
    });
});

/**
 * @description returns a projects by name
 * @returns {Project}
 */
app.get('/api/projects/:tag', (req, res, next) => {
    const q = req.params.tag;

    Project.findOne({tag: q}, (err, data) => {
        if (err) return console.error(err);
        res.send(data);
    });
});

/**
 * @description deletes project by name including all its BOM files
 * @returns {void}
 */
app.delete('/api/projects/:tag', (req, res, next) => {
    const q = req.params.tag;

    if (q === 'delete-all') {
        Project.deleteMany({}, (err) => {
            if (err) return console.error(err);
            res.sendStatus(204);
        });
    } else {
        Project.findOne({tag: q}, (err, data) => {
            if (err) return console.error(err);
            if (data) {
                data.bomLists.forEach((list) => {
                    MaterialList.findOneAndDelete({id: list}, (err) => {
                        if (err) return console.error(err);
                    });
                });
                data.remove();
                console.log(q + ' deleted.');
                return res.sendStatus(204);
            }
            res.sendStatus(404);
        });
    }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);