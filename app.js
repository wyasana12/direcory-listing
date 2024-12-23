const express = require('express');
const ErrorHandler = require('./utils/ErrorHandler');
const session = require('express-session');
const flash = require('connect-flash');
const ejsmate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const path = require('path');
const app = express();

mongoose.connect('mongodb://127.0.0.1/bestpoints')
    .then((result) => {
        console.log('connect to mongoDB');
    }).catch((err) => {
        console.log(err);
    });

app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'this-is-my-security-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

//route
app.get('/', (req, res) => {
    res.render('home');
});

app.use('/', require('./routes/auth'));
app.use('/places', require('./routes/places'));
app.use('/places/:place_id/reviews', require('./routes/reviews'));

app.all('*', (req, res, next) => {
    next(new ErrorHandler());
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no, something went wrong!"
    res.status(statusCode).render('error', { err });
});


app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000/');
});