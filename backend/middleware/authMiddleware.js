const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel')

const protect = asyncHandler(async (req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('-password');
            if(!req.user) {
                res.status(401)
                throw new Error('not authorized') 
            }
            const userUpdatedAt = parseInt(req.user.updatedAt.valueOf()/1000);
            const jwtIssueAt = decoded.iat;
            if (userUpdatedAt > jwtIssueAt) {
                res.status(401)
                throw new Error('not authorized') 
            }


            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('not authorized')
        }
    }

    if(!token) {
        res.status(401)
        throw new Error('not authorized, no token')
    }

})

module.exports = {protect}