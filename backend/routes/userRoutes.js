const express = require('express')
const router = express.Router()
const {loginUser,getMe,updatePassword} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

//router.post("/", registerUser)
router.post("/login", loginUser)
router.get("/me",protect, getMe)
router.put("/update-password",protect,updatePassword);


module.exports = router