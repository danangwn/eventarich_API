const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // butuh diliat enaknya pake types object atau increment number aja
    category_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    
    date: { 
        type: Date 
    },
    
    description: {
        type: String
    },

    address: {
        type: String
    },

    user_phone_number: {
        type: String,
        min: 11,
        max: 12
    },

    budget: {
        type: Number
    }

});

module.exports = mongoose.model('Order', OrderSchema);