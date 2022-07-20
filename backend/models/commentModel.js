const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    adminUser:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Post'
    },
    source:{
        type:String,
        required:true,
    },
    username: {
        type: String,
        required: [true, 'Please add a username to the comment']
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
    },
    comment: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        required: true,
        default: false,
    }

    
},{
    timestamps: true,
})

module.exports = mongoose.model('Comment', commentSchema);