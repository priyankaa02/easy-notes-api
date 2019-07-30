const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({path: process.env.PWD + '/.env'});
var cors = require('cors');
var path = require('path');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());
app.options('*', cors());


mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

// listen for requests
require('./app/routes/note.routes.js')(app);
require('./app/routes/category.routes.js')(app);
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is listening on port 3000");
});
