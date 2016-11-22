var User        = require('mongoose').model('User');
var passport    = require('passport');


var getErrorMessage = function(err){
    var message = '';
    if (err.code){
        switch (err.code){
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:    
                message = 'something went wrong';
        }
    } else {
        for(var errName in err.errors){
            if (err.errors[errName].message) message = err.errors[errName].message;

        }
    }
    return message;

};

exports.render = function (req, res){
    //Sessions    
    if(req.session.lastVisit ){
        console.log(req.session.lastVisit);
    }
    req.session.lastVisit = new Date();
    
    res.render('index',  {
        title : 'Hello World',
        user: JSON.stringify(req.user)
    });

};



exports.renderSignin = function(req, res, next){
    if(!req.user){
        res.render('signin', {
            title:      "sign-in form",
            messages:   req.flash('error') || req.flash('info')
        });
    }else{
        return res.redirect('/' + req.user.username);
    }
};

exports.signup      = function (req, res, next){
    if(!req.user){
        var user    = new User (req.body);
        var message = null;
        user.provider   = 'local';
        user.save(function(err){
            if(err){
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/signup');
            }
            req.login(user, function(err){
                if(err) return next (err);
                return res.redirect('/');
            } );
        });

    }else{
        return res.redirect('/');
    }
};

exports.renderSignup   = function(req, res, next){
    if(!req.user){
        res.render('signup', {
            title:  'Sign-Up Form',
            messages:    req.flash('error')
        });
    }else{
        return res.redirect('/');
    }
}


exports.signout = function (req, res){
    req.logout();
    res.redirect('/');
};



exports.create =    function (req, res, next){
    var user= new User(req.body);

    user.save(function (err){
        if (err){
            return next (err);
        } else {
            res.json(user);
        }
    });
};

exports.list = function(req, res, next){
    User.find({},
    "firstName" + " " +
    "lastName" + " " + 
    "fullName" + " " +
    "email" + " " +
    "username" + " " +
    "website" + " " +
    "role" + " " +
    "status" + " " +
    "officePhone" + " " +
    "organisation" + " " +
    "title" + " " +
    "department" + " " +
    "description",
    function (err, users){
        if(err){
            return next (err);
        } else {
            res.json(users);
        }
    });
};

exports.read = function (req, res){
    res.json(req.user);
};


exports.userByID = function (req, res, next, id){
    console.log('Test - userById')
    User.findById(id).select('-password -salt').exec(function(err, user){
        if (err) return next (err);
        if(!user) return next (new Error('failed to load user' + id) );

        req.user = user;
        next();
    });
};






exports.update = function (req, res, next){
    User.findByIdAndUpdate(req.user.id, req.body, function(err, user){
        if (err){
            return next (err);
        } else {
            res.json(user);
        }
    });
};


exports.delete = function (req, res, next){
    req.user.remove(function (err){
        if(err){
            return next (err);
        } else {
            res.json(req.user);
        }
    });
};

exports.requiresLogin = function (req, res, next){
    if(!req.isAuthenticated() ){
        return res.status(401).send({
            message:    'User is not logged in'
        });
    }
    next()
};


exports.userStatusChange          = function(io, socket){
    io.emit('userStatusChange', {
        type:           'status',
        text:           'connected',
        statusSet:      Date.now(),
        user:           socket.request.user,
        userId:         socket.request.user.id
    });

    socket.on('userStatusChange', function(statusChange) {
        statusChange.status =       'status',
        statusChange.statusSet =    Date.now(),
        statusChange.user   =       socket.request.user,
        statusChange.userId =       socket.request.user.id;
        
        console.log(statusChange);
        io.emit('userStatusChange', statusChange);
    });

    socket.on('disconnect', function(){
        io.on('userStatusChange', {
            type:           'status',
            text:           'disconnected',
            statusSet:      Date.now(),
            user:           socket.request.user,
            userId:         socket.request.user.id
        } );

        console.log('disconnected');
    });
};

