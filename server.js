// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var passport = require('passport');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var oauth2Controller = require('./controllers/oauth2');
var clientController = require('./controllers/client');
var morgan = require('morgan');
const port = process.env.PORT || 3000

//mongoose.connect('mongodb://conor1123:test123@testcluster-shard-00-00-h2vrz.mongodb.net:27017,testcluster-shard-00-01-h2vrz.mongodb.net:27017,testcluster-shard-00-02-h2vrz.mongodb.net:27017/test?ssl=true&replicaSet=testCluster-shard-0&authSource=admin');
mongoose.connect('mongodb://conor1123:test123@testcluster-shard-00-00-h2vrz.mongodb.net:27017,testcluster-shard-00-01-h2vrz.mongodb.net:27017,testcluster-shard-00-02-h2vrz.mongodb.net:27017/test?ssl=true&replicaSet=testCluster-shard-0&authSource=admin');

// Create our Express application
var app = express();

//app.use(morgan('combined'));

// Set view engine to ejs
app.set('view engine', 'ejs');

//Middleware for public stuff like images.
app.use(express.static("public"));

// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use express session support since OAuth2orize requires it
app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
}));

// Use the passport package in our application
app.use(passport.initialize());

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /users
router.route('/api/users')
  .post(userController.postUsers)
  .get(userController.getUsers);

// Create endpoint handlers for /clients
router.route('/api/clients')
  .post(authController.isAuthenticated, clientController.postClients)
  .get(authController.isAuthenticated, clientController.getClients);

// Create endpoint handlers for oauth2 authorize
router.route('/api/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

// Create endpoint handlers for oauth2 token
router.route('/api/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);

// Register all our routes with /api
app.use(router);

// Start the server
app.listen(port);