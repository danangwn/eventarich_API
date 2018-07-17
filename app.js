const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var mongo = require('mongodb');
const keys = require('./config/keys')
const fetch = require('node-fetch')

const categoryRoutes = require('./api/routes/categories');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const eventRoutes = require('./api/routes/events');
const favoriteRoutes = require('./api/routes/favorites');
const categoryeventRoutes = require('./api/routes/categoryevents');
const adminRoutes = require('./api/routes/admins');

// mongoose.connect('mongodb://localhost/eventarich_me');
// // mongoose.connect(keys.mongodb.dbURI, () => {
// //     console.log('connected to mongodb');
// // });
// // mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017');
mongoose.connect('mongodb://localhost/eventarich_me');
mongoose.Promise = global.Promise;

var request = require('request');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views/AdminLTE-2.4.3/AdminLTE-2.4.3'));




//SEMENTARA ADMIN NITIP DISINI


// app.get('/admin', (req, res) => {  
// function getRequest(url) {
//     return new Promise(function (success, failure) {
//         request(url, function (error, response, body) {
//             if (!error && response.statusCode == 200) {
//                 success(body);
//             } else {
//                 failure(error);
//             }
//         });
//     });
// }

// getRequest('http://localhost:3000/admins/orders/').then(function (body1) {
//     // do something with body1
//             var locals1 = body1 ;// console.log(data);
//             var data1 = JSON.parse(locals1);
//             console.log(data1);
//     return getRequest('http://localhost:3000/admins/events/');
// }).then(function (body2) {
//             var locals2 = body2 ;// console.log(data);
//             var data2 = JSON.parse(locals2);
//             console.log(data2);
//     // do something with body2
//     return getRequest('http://localhost:3000/admins/users/');
// }).then(function (body3) {
//             var locals3 = body3 ;// console.log(data);
//             var data3 = JSON.parse(locals3);
//             console.log(data3);
//     // do something with body3
//     //And so on...
// });
//   res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/index', {data1: data1,data2:data2,data3:data3});
// });

function get(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}

app.get('/admin', (req, res) => {
  Promise.all([
    get('http://localhost:3000/admins/orders/'),
    get('http://localhost:3000/admins/events/'),
    get('http://localhost:3000/admins/users/'),
  ]).then(([orders, events, users]) =>
    res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/index',{
      orders: orders.count,
      events : events.count,
      users : users.count
    }))
    .catch(err => res.send('Ops, something has gone wrong'))
})

app.get('/admin/orders', (req, res) => {
    request.get('http://localhost:3000/admins/orders/', function(err, response, body) {
        if (!err && response.statusCode == 200) {
            var locals = body ;// console.log(data);
            var data = JSON.parse(locals);
            console.log(data);
            res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/orders', {data: data});
        }
    });
});

app.get('/admin/events', (req, res) => {
    request.get('http://localhost:3000/admins/events/', function(err, response, body) {
        if (!err && response.statusCode == 200) {
            var locals = body ;// console.log(data);
            var data = JSON.parse(locals);
            console.log(data);
            res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/events', {data: data});
        }
    });
});

app.get('/admin/users', (req, res) => {
    request.get('http://localhost:3000/admins/users/', function(err, response, body) {
        if (!err && response.statusCode == 200) {
            var locals = body ;// console.log(data);
            var data = JSON.parse(locals);
            console.log(data);
            res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/users', {data: data});
        }
    });
});

app.get('/admin/users/:id', (req, res) => {
    var id = req.params.id;
    console.log(id);
    request.post('http://localhost:3000/admins/users/delete/:id', function(err, response, body) {
        if (!err && response.statusCode == 200) {
            var locals = body ;// console.log(data);
            var data = JSON.parse(locals);
            console.log(data);
            res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/users', {data: data});
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
app.use('/admins', adminRoutes);


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
