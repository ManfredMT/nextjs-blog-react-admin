const mongoose = require('mongoose');

const linkSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    name:{
        type: String,
        required: [true, 'Please add a name to the link']
    },
    website:{
        type: String,
        required: [true, 'Please add a url']
    },
    description:{
        type: String, 
    },
    picture:{
        type: String,
    }
})

module.exports = mongoose.model('Link', linkSchema)