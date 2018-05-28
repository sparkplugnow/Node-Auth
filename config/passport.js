//load reqiured setting
var LocalStrategy = require('passport-local').Strategy;


//load user model
var User = require("../model/user");

module.exports = function(passport){
    
    // passport session setup

    passport.serializeUser(function(user,done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id,function(err,user){
            done(err, user);
        });
    });

    // Local SignUp

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },

    function (req, email, password,done){

        //jump code till the data is returned

        process.nextTick(function(){
            //check if the user already exists

        User.findOne({'local.email':email}, function(err,user){

            if(err)
                return done(err);

            //check if there's a user with that email

            if (user){
                return done(null, false, req.flash('signupMessage','That mail is already taken.'));
            } else {
                //if there's no new user, create an new user

                var newUser = new User();

                //set the user local variable

                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);

                //save the user
                newUser.save(function(err){
                    if(err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });
        })

    }
    
    ));
};
