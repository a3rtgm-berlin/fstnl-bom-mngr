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
const createRpn = require('./createRpn');
const utils = require('./utils');
const auth = require('./authorization');
const verifcation = require('./models/verification');

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
const RPN = require("./models/rpn").RPNModel;
const Planogram = require("./models/planogram");

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
//mongoose.connect('mongodb://test:test@91.250.112.78:27017/testDB', { useNewUrlParser: true, 'useFindAndModify': false, 'useUnifiedTopology': true });
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

/**
 * @description Handles upload of ArbMatrix files
 * @param {*} file
 * @method POST
 */
app.post('/api/upload/matrix', upload.matrix);
app.post('/api/upload/exclude', upload.excludeList);

/**
 * @description gets the work station matrix
 * @method get
 * @returns {void}
 */
app.get('/api/matrix', (req, res) => auth.guard(req, res, () => {
    ArbMatrix.find((err, data) => {
        if (err) {
            res.sendStatus(404);
            return console.error(err);
        }
        res.send(data[0]);
    });
}));

/**
 * @description gets the exclude list
 * @method GET
 * @returns {void}
 */
app.get('/api/exclude', (req, res) => auth.guard(req, res, () => {
    ExcludeList.find((err, data) => {
        if (err) {
            res.sendStatus(404);
            return console.error(err);
        }
        res.send(data[0]);
    });
}));

/**
 * @description Handles uploaded consumption files
 * @param {*} file the consumption file uploaded
 * @method POST
 * @returns {void}
 */
app.post('/api/upload/consumption/:id', upload.consumption);

/**
 * @description Handles uploaded planogram files
 * @param {*} file the planogram file uploaded
 * @method POST
 * @returns {void}
 */
app.post('/api/upload/planogram/:id', upload.planogram);

/**
 * @description Handles uploaded BOM files
 * @param {*} file the BOM file uploaded
 * @method POST
 * @returns {void}
 */
app.post('/api/upload/bom', upload.bom);

/**
 * @description creates the RPN from the current master and project vals
 * @param id
 * @method get
 */
app.get('/api/rpn/:id', (req, res) => auth.guard(req, res, (role) => {
    const id = req.params.id;

    RPN.findOne({id: id}, (err, rpn) => {
        if (rpn) {
            res.send(rpn);
        } else {
            createRpn(req, res);
        }
    });
}));

app.get('/api/planogram/:id', (req, res) => auth.guard(req, res, () => {
    const id = req.params.id;

    Planogram.findOne({id: id}, (err, data) => {
        if (err) {
            res.status(500).send(err);
            return console.error(err);
        }

        return res.json(data);
    });
}));

app.get('/api/planogram/create/:id', (req, res) => auth.guard(req, res, async () =>{
    const id = req.params.id;
    const master = await MasterBom.findOne({id: id}).exec();
    const lastPlanogram = await Planogram.findOne({id: {$lt: id}}).sort({id: -1}).exec();
    const planogram = master.json.map(part => {
        const oldPos = lastPlanogram ? lastPlanogram.parts.find(p => p.id === part.id) : null;
        return {
            Material: part.Material,
            Station: part.Station,
            id: part.id,
            position: oldPos ? oldPos.position || [] : [],
        }
    });
    
    Planogram.findOneAndUpdate({id: id}, {
        parts: planogram,
        updated: new Date(),
    }, {
        upsert: true,
        new: true,
    }, (err, data) => {
        if (err) {
            res.sendStatus(500);
            console.error(err);
        }
        else {
            master.planogram = true;
            master.save();

            res.status(201).json(data);
            console.log(`Planogram ${id} created`);
        }
    });
}));

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
app.get('/api/master/rebuild/:id', (req, res) => auth.guard(req, res, (role) => {
    if (role > 1) return res.sendStatus(401);

    const q = req.params.id;

    RPN.findOneAndDelete({id: q}, () => { console.log(`RPN ${q} deleted`)});
    Planogram.findOneAndDelete({id: q}, () => { console.log(`Planogram ${q} deleted`)});
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
}));

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
app.get('/api/master/all', (req, res) => auth.guard(req, res, () => {
    MasterBom.find((err, data) => {
        if (err) {
            res.sendStatus(500);
            return console.error(err);
        }
        res.send(data.map(master => ({
            id: master.id,
            moving: master.comparison ? master.comparison.meta.last : '-',
            date: master.date,
            projects: master.projects
        })));
    });
}));

/**
 * @description returns one selected list by date
 * @todo ... and project
 * @returns {MaterialList}
 */
app.get('/api/master/get/:id', (req, res) => auth.guard(req, res, () => {
    const q = req.params.id;

    MasterBom.findOne({id: q}, (err, data) => {
        if (err) return console.error(err);
        res.send(data);
    });
}));

/**
 * @description deletes a master by id
 * @todo ... and project
 * @returns {MaterialList}
 */
app.delete('/api/master/delete/:id', (req, res) => auth.guard(req, res, (role) => {
    if (role > 1) return res.sendStatus(401);

    const q = req.params.id;

    MasterBom.findOneAndDelete({id: q}, (err) => {
        if (err) {
            res.sendStatus(404)
            return console.error(err);
        }
        res.status(204).send('deleted');
    });
}));

/**
 * @description returns all uploaded BOM Lists
 * @todo ... for a selected project?
 * @returns {[MaterialList]}
 */
app.get('/api/lists', (req, res) => auth.guard(req, res, () => {
    MaterialList.find((err, data) => {
        if (err) return console.error(err);
        res.send(data);
    });
}));

/**
 * @description returns one selected list by date
 * @todo ... and project
 * @returns {MaterialList}
 */
app.get('/api/lists/:id', (req, res) => auth.guard(req, res, () => {
    const q = req.params.id;

    MaterialList.findOne({id: q}, (err, data) => {
        if (err) return console.error(err);
        res.send(data);
    });
}));

/**
 * @description deletes a list by ID (Project + Date)
 * @todo ... and project
 * @returns {void}
 */
app.delete('/api/lists/:id', (req, res) => auth.guard(req, res, (role) => {
    if (role > 2) return res.sendStatus(401);

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
}));

/**
 * @description returns all metas for the boms of a a project
 */
app.get('/api/project/meta/:tag', (req, res) => auth.guard(req, res, () => {
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
}));

/**
 * @description returns all metas for a single bom
 */
app.get('/api/lists/meta/:id', (req, res) => auth.guard(req, res, () => {
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
}));

/**
 * @description rebuilds a given project BOM file with the updated project values
 * @param {String} id the bom id
 * @returns {void}
 */
app.get('/api/lists/update/:id', (req, res) => auth.guard(req, res, (role) => {
    const q = req.params.id;

    MaterialList.findOne({id: q}, (err, bom) => {
        if (err) {
            res.sendStatus(404);
            return console.error(err);
        }
        utils.updateSingleBom(bom, res);
    });
}));

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


app.post('/api/newuser/', (req, res, next) => {
    const q = req.params.username;

    User.findOne({username: q}, req.body, (err, data) => {
        if(err) {
            return res.send(418);
        } 
        
        if (!data) {
            var validUserData = new User(req.body);
            validUserData.save()
            res.status(200).send(true);
        } else {
            console.log("User with name" + q + "is already exisiting");
            res.status(200).send(false);
        }
    });
});

app.post('/api/token/verify', (req, res) => {
    if (req.body.token) {
        const decoded = jwt.verify(req.body.token, verifcation.privateKey, verifcation.verifyOptions, (err, decoded) => {
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
    let token = jwt.sign({
        "role": req.user.role,
    }, verifcation.privateKey, {
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
            role: req.user.role
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
app.get('/api/projects', (req, res) => auth.guard(req, res, () => {
    Project.find((err, data) => {
        if (err) {
            res.sendStatus(418);
            return console.error(err);
        }
        res.send(data);
    });
}));

app.get('/api/allusers', (req, res, next) => {
    User.find((err, data) => {
        if (err) {
            res.sendStatus(418);
            return console.error(err);
        }
        res.send(data);
    }); 
})

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

app.get('/api/projects/:tag', (req, res) => auth.guard(req, res, () => {

}));

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

app.delete('/api/users/:username', (req, res, next) => {
    const q = req.params.username;
    console.log(q);
    User.findOneAndDelete({username: q}, (err) => {
        if(err) {
            res.sendStatus(418);
            return console.error(err);
        }
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);