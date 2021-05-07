const User = require('../models/User');
module.exports = function(app, passport, Item, day) {

    // register
    app.get('/register', function(req, res) {
        if(req.user){
            res.render('pagenotfound');
        } else{
            res.render('auth/register', {msgA: req.flash('alreadyfounderror'), msgB: req.flash('regerror')});
        }
    });

    app.post('/register', function(req, res, next) {
        var Email = req.body.email;
        var Username = req.body.username;
        var Password = req.body.password;

        User.findOne({ email: Email }, function(err, foundUser){
            if(err){
                req.flash('regerror', 'An error has occured !  Please try again !!!')
                res.redirect('/register');
            }else if(foundUser){
                req.flash('alreadyfounderror', 'This email is already registered, try another or login!');
                res.redirect('/register');
            }else{
                User.register({ email: Email, username: Username }, Password, function(err, user) {
                    try {
                        if(!user){
                            console.log('already exist');
                            req.flash('alreadyfounderror', 'This username is taken, try another!');
                            res.redirect('/register');
                        }else{
                            req.flash('registersuccess', 'Successfully registered!');
                            res.redirect('/login');
                        }
                    } catch (err) {
                        req.flash('regerror', 'An error has occured !  Please try again !!!')
                        res.redirect('/register');
                    }
                });
            }
        });
    });

    // login
    app.get('/login', function(req, res) {
        if(req.user){
            res.render('pagenotfound');
        } else {
            res.render('auth/login', {msgA: req.flash('registersuccess'), msgB: req.flash('usernameandpassworddidnotmatch'), msgC: req.flash('error'), msgD: req.flash('loginfirst')});
        }
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
          if (err) {
            req.flash('error', 'An error has occured, Please try again!')
            return next(err); 
        }
          if (!user) { 
            req.flash('usernameandpassworddidnotmatch', 'Username and password did not match !  Please try again !!!')
            return res.redirect('/login'); 
        }
          req.logIn(user, function(err) {
            if (err) { 
                req.flash('error', 'An error has occured, Please try again!')
                return next(err); 
            }
            return res.redirect('/todo');
          });
        })(req, res, next);
      });

    // logout
    app.get('/logout', function(req, res) {
        if (req.isAuthenticated()) {
            req.logout();
            // req.session.destroy();
            res.redirect('/login');
        } else {
            res.redirect('/login');
        }
    });

}