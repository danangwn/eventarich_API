const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');   //Generate ID
const checkAuth = require('../middleware/checkauth');
const Order = require('../models/order');
const Category = require('../models/category');
const jwt = require('jsonwebtoken');
// Routesnya /orders

router.get('/', checkAuth, (req, res, next) => {
    Order.find()
        .select('category date budget address description _id')
        .populate('category', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        category: doc.category,
                        date: doc.date,
                        budget: doc.budget,
                        address: doc.address,
                        description: doc.description,
                        request: {
                            type: "GET",
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

Date.prototype.addHours = function(h){
    this.setHours(this.getHours()+h);
    return this;
}

// router.post('/',  (req, res, next) => {
//     const order = new Order({
//         _id: new mongoose.Types.ObjectId(),
//         // category : req.body.category,moment().format('YYYY-MM-DD')
//         date_created : new Date().addHours(7),
//         date: req.body.date,
//         budget: req.body.budget,
//         address : req.body.address,
//         description: req.body.description
//     });

//     order
//         .save()
//         .then(result => {
//             console.log(result);
//             res.status(200).json({
//                 message: 'Order successfully created',
//                 createdOrder: {
//                     category: result.category,
//                     date: result.date,
//                     budget: result.budget,
//                     address: result.address,
//                     description: result.description,
//                     _id: result._id,
//                     request: {
//                         type: 'GET',
//                         url: "http://localhost:3000/orders/" + result._id
//                     }
//                 }
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

router.post('/', (req, res, next) => {
    Category.findById(req.body.categoryId)
        .then(category => {
            if(!category) {
                return res.status(404).json({
                    message: "Category not found"
                });
            }
            const order = new Order ({
                _id: mongoose.Types.ObjectId(),
                date_created : new Date().addHours(7),
                date: req.body.date,
                budget: req.body.budget,
                address : req.body.address,
                description: req.body.description,
                category: req.body.categoryId
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Order stored",
                createdOrder: {
                category: result.category,
                date: result.date,
                date_created: result.date_created,
                budget: result.budget,
                address: result.address,
                description: result.description,
                _id: result._id,
                },
                request: {
                    type : "GET",
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:orderId', checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('category', 'name')
        .exec()
        .then(order => {
            if(!order) {
                return res.status(404).json({
                    message: "Order not Found"
                });
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/category/:categoryId', checkAuth, (req, res, next) => {
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
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// router.get('/:categoryId',  (req, res, next) => {
//         var categoryId = req.params.categoryId;
//         var cursor = db.collection('order').find({
//             category: 'categoryId'
//           });
//         res.status(200).json({
//                     order: order,
//                     request: {
//                         type: 'GET',
//                         url: 'http://localhost:3000/orders'
//                     }
//                 });
//             });


router.delete('/:orderId', checkAuth, (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
    .exec()
        .then(result => {
            res.status(200).json({
                message: "Order Deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { productId: "ID", quantity: "Number" }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;
