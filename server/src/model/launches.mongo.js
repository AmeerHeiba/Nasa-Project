// This will define how we talk to mongo db

// requiring mongoose

const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type:Number,
        default: 100,
        required: true,
        unique: true
    },
    mission: {
        type:String, 
        required: true
    },
    rocket: {
        type:String,
        required: true
    },
    launchDate: {
        type:Date,
        required: true,
    },

    target: {
        type:String,
        

    },
    customers: [String],
    upcoming: {
        type:Boolean,
        required: true,
    },
    success: {
        type:Boolean,
        required: true,
        default: true,
    },
    
});

// connects launches schema to the launches collection in mongoDB

module.exports= mongoose.model('Launch', launchesSchema);