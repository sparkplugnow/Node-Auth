var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

//Get Homepage
router.get('/', function (req, res) {
    res.render('index');
});

//Get login route
router.get('/login', function (req, res) {
    res.render('login');
});

// Register
router.get('/register', function (req, res) {
    res.render('register');
});

// Register User
router.post('/register', function (req, res) {
    console.log(req.body)
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.confirmPassword;

    //validation
    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('email', 'email is not valid').isEmail();
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('password', 'password2 is required').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors

        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
        });
        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/login');
    }
});
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
  passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
  done(err, user);
        });
      });
router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),
    function (req, res) {
        res.redirect('/');
    })
router.get('/logout', function (req, res, next) {
    req.logout();
   
    req.flash('success_msg', 'you are logged out');

    res.redirect('/login');
});

module.exports = router;

