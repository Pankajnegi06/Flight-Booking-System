const mongoose = require('mongoose');


const flightSchema = new mongoose.Schema({
    flightId:{
        type:String,
        required:true
    },
    base_price:{
        type:Number,
        required:true
    },
    airline:{
        type:String,
        required:true
    },
    departure_city:{
        type:String,
        required:true,
    },
    arrival_city:{
        type:String,
        required:true,
    },
    current_price:{
        type:Number,
        required:true
    },
    arrival_time:{
        type:Date,
        required:true,
    },
    surge_active_until:{
        type:Date,
    }
})

module.exports = mongoose.model('Flight', flightSchema);
