var users       = require('../../app/controllers/users.server.controller');
var passport    = require('passport');

module.exports  = function (app){

    app.get('/', users.render);

    app.route('/signup')
        .get(users.renderSignup)
        .post(users.signup);
    
    app.route('/signin')
        .get(users.renderSignin)
        .post(passport.authenticate('local', {
            successRedirect:    '/',
            failureRedirect:    '/signin',
            failureFlash:       true
        } ));

    app.get('/signout', users.signout);

    app.route('/api/users')
        .get(users.requiresLogin)
        .get(users.list);

     app.route('/api/users/:userId/edit')
        .get(users.read)
        .put(users.update)
        .delete(users.delete);

    app.route('/api/users/:userId')
        .get(users.read)
        .put(users.update)
        .delete(users.delete);

    app.param('userId', users.userByID);

};