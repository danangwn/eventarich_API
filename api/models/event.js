const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    // butuh diliat enaknya pake types object atau increment number aja
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    title: {
        type: String,
        max: 60,
        required: true     
    },

    picture: {
        type: String,
        required: true
    },

    date_create: {
        type: Date,
        required: true
    },

    date_event: {
        type: Date,
        required: true
    },

    description: {
        type: String
    },

});

module.exports = mongoose.model('Event', EventSchema);