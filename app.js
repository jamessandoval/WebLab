// James Sandoval
// 24MAR2017

var express = require('express'),
    address = require('network-address'),
    routes = require('./routes/index'),
    path = require('path'),
    user = require('./routes/user'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    passport = require('passport'),
    errorhandler = require('errorhandler'),
    flash = require('connect-flash'),
    app = express(),
    $ = require('jquery'),
    LocalStrategy = require('passport-local').Strategy,
    mongo = require('mongodb'),
    mongoose = require('mongoose'),
    exports = module.exports = {};
    var exphbs  = require('express-handlebars');
    var hbs  = require('./helpers/helpers.js')(exphbs);

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;
app.engine('hbs', hbs.engine,exphbs({defaultLayout: 'main'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookieParser());

app.set('port', 3001);
app.set('view cache', false); // Set this later, false for development    

// **** USE ONLY IN DEV MODE **** 
// This is to create a session when script is loaded, delete in production mode
// also for really secure cookies, use https
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/user', user);
app.use('/', routes);

if ('development' === app.get('env')) {
    app.use(errorhandler());
}

var server = app.listen(app.get('port'), function() {
    console.log('Express started on ' + address() + ':' + app.get('port') + '; press Ctrl-C to terminate.');
});
// *** Routes ***
app.use(function(req, res) {
    res.status(303);
    res.render('303');
});

app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

exports.closeServer = function() {
    server.close();
};
