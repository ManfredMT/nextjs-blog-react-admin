const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a title to the post']
    },
    authors: {
        type: [String],
        required: true
    },
    tags: {
        type: [String],
    },
    category: {
        type: String,
        required: [true, 'Please add a category to the post']
    },
    draft: {
        required:true,
        type: Boolean,
    },
    summary: {
        type: String,
    },
    canonicalUrl: {
        type: String,
    },
    image: {
        type: Buffer,
    },
    content: {
        type: String,
    }

},{
    timestamps: true,
})

module.exports = mongoose.model('Post', postSchema);