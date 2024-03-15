const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    title:{
        type: String,
        required: [true, 'Please add a title to the image']
    },
    description:{
        type: String, 
    },
    imageUrl:{
        type: String,
        required:true
    },
    // hotlinkProtection: {
    //     required:true,
    //     type: Boolean,
    // },
},{
    timestamps: true,
})

module.exports = mongoose.model('Image', imageSchema)