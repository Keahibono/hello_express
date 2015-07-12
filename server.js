var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var config = require('./config/config.json');
var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    var admin = config.admin;

    if (!admin){
      return done(null, false, { message: 'No admin configured.' });
    }

    if (!username){
      return done(null, false, { message: 'Incorrect username.' });
    }

    if (username !== admin.username){
      return done(null, false, { message: 'Incorrect username.' });
    }

    if (password !== admin.password){
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, admin);
  }
));

app.set('views', './views')
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
  store: new RedisStore(),
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10000
  }
}));



// app.use(function(req, res, next){  COUNTS SESSION VIEWS
//   var sess = req.session;
//   if (sess.views){
//     sess.views++;
//   } else {
//     sess.views = 1;
//   }
//   console.log('viewed ' + sess.views + ' times');
//   next();
// });

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
  res.render('content', { name: req.session.name });
});

// app.post('/sign-in', function(req, res){
//   req.session.name = req.body.userName;
//   res.redirect('/');
// });

app.post('/login',
  passport.authenticate('local', {  successRedirect: '/secret',
                                    failureRedirect: '/',
                                    session: false
  })
);

app.get('/secret', function (req, res, next){
  res.send('SECRET');
});

var server = app.listen(3000, function(){
	console.log('Everything is fine');
});