var config      = require('./config');
var http        = require('http');
var socketio    = require('socket.io');
var express     = require('express');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var compress    = require('compression');
var methodOverride = require('method-override');
var flash       = require('connect-flash');
var passport    = require('passport');
var session     = require('express-session');
var MongoStore  = require('connect-mongo')(session);  


module.exports = function(db){
    var app     = express();

    //Socket.io
    var server  = http.createServer(app);
    var io      = socketio.listen(server);

    //define environment
    if (process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
    }else if (process.env.NODE_ENV === 'production'){
        app.use(compress());
    }




    io.on('connection', function (socket) {

        console.log('server - connection event');

        socket.on('userStatusChange', function (data) {
            console.log('server - userStatusChange');
            socket.broadcast.emit('userStatusChange');
        });
    });




    app.use(bodyParser.urlencoded({
        extended:   true
    }) );
    app.use(bodyParser.json());
    app.use(methodOverride());


    var mongoStore  = new MongoStore({
        db: db.connection.db
    });


    app.use(session({
        saveUninitalized:   true,
        resave:             true,
        secret:             config.sessionSecret,
        store:              mongoStore
    }));

    //views
    app.set('views', './app/views');
    app.set('view engine', 'ejs');



    //passport
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());

    //routes
        require('../app/routes/users.server.route.js')(app);

    //static files
        app.use(express.static('./public'));

        return server;
};