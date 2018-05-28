//set up

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const configDB = require('./config/database');

//configuration
mongoose.connect(configDB.url); //connect to MongoDB

require('./config/passport')(passport);

//setup express app
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs'); //setup the templating system

//Passport requirements
app.use(session({ secret: 'ilovenodejs'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
require('./app/routes')(app,passport);

//launch
app.listen(port);
console.log('The magic happens on port '+ port);

