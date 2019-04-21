const express = require('express');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
require('./models');
require('./config');
const schema = require('./schema/schema');

// express is fired
const app = express();

// mongodb address
const MONGO_URI = `mongodb://${ process.env.MONGO_USER_NAME }:${ process.env.MONGO_PASSWORD }@ds157529.mlab.com:57529/larycal-db`;

// mogo connection error
if (!MONGO_URI) {
  throw new Error('You must provide a MongoLab URI');
}

// assign promise object
mongoose.Promise = global.Promise;

// connect
mongoose.connect(MONGO_URI, { useCreateIndex: true, useNewUrlParser: true });

// setup callback for the promise
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error));

// basic graphql req content is application/json
app.use(bodyParser.json());

// setup Access-Control-Allow-Origin
app.use((req, res, next) => {
  // allow access from any user
  res.setHeader('Access-Control-Allow-Origin', '*');
  // setup methods to be allowed
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  // setup authorization header particularly POST method which is a mothod of graphql
  // Authorization header is not setup yet in the client, BTW. 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // if Req.method === OPTIONS from the Apollo-based client sends success codes
  // Then, when the client access to the server with the other mothods it won't stop here.
  if(req.method === 'OPTIONS') {
    // stop app.use and won't go to next app.use()
    return res.sendStatus(200);
  }
  next();
});

// to prevent from running twice because of requesting "/favicon.ico" end point from browser
app.use((req, res, next) => {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({ nope: true });
  } else {
    next();
  }
});

// building graphql end point by using express-graphql
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

// the express server is up.
app.listen(7000, () => {
  console.log('Listening');
});

module.exports = app;