const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');   //Generate ID
// const checkAuth = require('../middleware/checkauth');
const Order = require('../models/order');
const Category = require('../models/category');
const User = require('../models/user');
const Event = require('../models/event');
// const jwt = require('jsonwebtoken');


//-------------- ORDERS --------------//

//Get
router.get('/orders', (req, res, next) => {
    Order.find()
        .populate('category', 'name')
        .populate('userId', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        category: doc.category,
                        date: doc.date,
                        date_created: doc.date_created,
                        budget: doc.budget,
                        address: doc.address,
                        description: doc.description,
                        status: doc.status,
                        userId: doc.userId,
                        // request: {
                        //     type: "GET",
                        //     url: 'http://localhost:3000/admins/orders/' + doc._id
                        // }
                    }
                })
            });
            // res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/events');
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//Get By Category
router.get('/category/:categoryId', (req, res, next) => {
    Order.find({category : req.params.categoryId})
        .exec()
        .then(order => {
            if(!order) {
                return res.status(404).json({
                    message: "Order not Found"
                });
            }
            res.status(200).json({
                order: order,
                // request: {
                //     type: 'GET',
                //     url: 'http://localhost:3000/orders'
                // }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//Status

//Accepted
router.patch('/accept/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.update({ _id: id }, { $set: {status : "Proccessed"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order Accepted",
                // request: {
                //     type: "PATCH",
                //     url: "http://localhost:3000/events" + id
                // }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Done
router.patch('/done/:orderId',  (req, res, next) => {
    const id = req.params.orderId;
    Order.update({ _id: id }, { $set: {status : "Done"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order Finised",
                // request: {
                //     type: "PATCH",
                //     url: "http://localhost:3000/events" + id
                // }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/delete/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.update({ _id: id }, { $set: {status : "Canceled"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order Canceled",
                // request: {
                //     type: "PATCH",
                //     url: "http://localhost:3000/events" + id
                // }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//-------------- EVENTS --------------//

//GET EVENTS
router.get('/events', (req, res, next) => {
    Event.find()
        .populate('userId', 'name')
        .populate('categoryevent', 'name')
        .select('')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                events: docs.map(doc => {
                    return {
                        title: doc.title,
                        date_create: doc.date_create,
                        date_event: doc.date_event,
                        description: doc.description,
                        event_image: doc.event_image,
                        _id: doc._id,
                        city: doc.city,
                        userId: doc.userId,
                        categoryevent: doc.categoryevent,
                        status: doc.status,
                        // request: {
                        //     type: "GET",
                        //     url: "http://localhost:3000/admins/events/" + doc._id
                        // }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//status

//Accepted
router.patch('/accept/:eventId', (req, res, next) => {
    const id = req.params.eventId;
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    Event.update({ _id: id }, { $set: {status : "Accept"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Event Accepted",
                // request: {
                //     type: "PATCH",
                //     url: "http://localhost:3000/events" + id
                // }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Rejected
router.patch('/reject/:eventId', (req, res, next) => {
    const id = req.params.eventId;
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    Event.update({ _id: id }, { $set: {status : "Rejected"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Event Rejected",
                // request: {
                //     type: "PATCH",
                //     url: "http://localhost:3000/events" + id
                // }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


//-------------- USERS --------------//

//GET users
router.get('/users', (req, res, next) => {
    User.find()
        .select('')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        _id: doc._id,
                        email: doc.email,
                        name: doc.name,
                        address: doc.address,
                        phone_number: doc.phone_number,
                        status: doc.status,
                        // request: {
                        //     type: "GET",
                        //     url: "http://localhost:3000/admins/users/" + doc._id
                        // }
                    }
                })
            };
            res.status(200).json(response);
            // .render('AdminLTE-2.4.3/AdminLTE-2.4.3/users');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/users/delete/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.update({ _id: id }, { $set: {status : "0"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User Deactivated",
                // request: {
                //     type: "PATCH",
                //     url: "http://localhost:3000/users" + id
                // }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
