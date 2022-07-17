const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    name:{
        type: String,
        required: [true, 'Please add a name to the blog']
    },
    email:{
        type: String,
    },
    github:{
        type: String,
    },
    zhihu:{
        type: String,
    },
    juejin:{
        type: String,
    },
    wx:{
        type: String,
    },
    description:{
        type: String, 
    },
    logo:{
        type: Buffer,
    }
})

module.exports = mongoose.model('Profile', profileSchema)