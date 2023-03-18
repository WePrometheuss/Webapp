const mongoose = require('mongoose');
const { stringify } = require('querystring');
const postSchema = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    number: {
        type:String,
        required:true
    },
    pass:{
        type:String,
    },
    email:{
        type:String,
    },
    enrollment:{
        type:String
    }
});

module.exports = mongoose.model('Posts', postSchema);