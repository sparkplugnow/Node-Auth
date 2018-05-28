module.exports = function(app,passport){

    //index page

    app.get('/', function(req,res){
        res.render('index.ejs'); //load the index.ejs file        
    });

    //Login part
    app.get('/login', function(req,res){

        //render the page and pass flash message
        res.render('login.ejs', {message: req.flash('LoginMessage')});
    });

    //Process login form
    app.post('/login', passport.authenticate('local-login',{
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    //Sign UP part
    app.get('/signup',function(req,res){

        //render message and pass flash message
        res.render('signup.ejs',{ message: req.flash('signupMessage')});
    });

    //process the signup form
    app.post('/signup', passport.authenticate('local-signup',{
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true //allow flash messages
    }));


    //Profile Section
    //we want to be sure if the user is protected to visit

    app.get('/profile', isLoggedIn, function(req,res){
        res.render('profile.ejs',{
            user : req.user
        });
    });

    app.get('/logout', function(req,res){
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req,res,next){
    
    //if user is authenticated in the session, carry on
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
};