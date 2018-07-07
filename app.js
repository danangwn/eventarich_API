const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var mongo = require('mongodb');

const categoryRoutes = require('./api/routes/categories');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const eventRoutes = require('./api/routes/events');
const favoriteRoutes = require('./api/routes/favorites');
const categoryeventRoutes = require('./api/routes/categoryevents');

mongoose.connect('mongodb://localhost/eventarich_me');
mongoose.Promise = global.Promise;

var request = require('request');
app.set('view engine', 'ejs');
// app.get('/', (req, res) => {
//     res.render('home', { user: req.user });
// });

app.get('/', (req, res) => {
    request.get('http://localhost:3000/orders/5b341b612d85fe2784086bfe', function(err, response, body) {
        if (!err && response.statusCode == 200) {
            var locals = body ;// console.log(data);
            var data = JSON.parse(locals);
            res.render('home', {data: data});
        }
    });
});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Routes which should handle requests
app.use('/categories', categoryRoutes); //Middleware
app.use('/orders', orderRoutes); //Middleware
app.use('/events', eventRoutes);
app.use('/users', userRoutes); //Middleware
app.use('/favorites', favoriteRoutes);
app.use('/categoryevents', categoryeventRoutes);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            status: error.status
        }
    });
});

//BUAT IONIC
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });

module.exports = app;
