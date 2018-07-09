const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');   //Generate ID
// const checkAuth = require('../middleware/checkauth');
const Order = require('../models/order');
const Category = require('../models/category');
const User = require('../models/user');
// const jwt = require('jsonwebtoken');


//GET ORDERS
router.get('/orders', (req, res, next) => {
    Order.find()
        // .select('category date budget address description _id')
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
                        request: {
                            type: "GET",
                            url: 'http://localhost:3000/admins/orders/' + doc._id
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

module.exports = router;
