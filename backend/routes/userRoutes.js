const express = require('express');
const router = express.Router();
const {loginUser,getMe,updatePassword} = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');
const rateLimit = require("express-rate-limit");

const limiterLogin = rateLimit({
    windowMs: 2 * 60 * 1000, // ms
    max: 3, // Limit each IP to xx requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

//router.post("/", registerUser)
router.post("/login",limiterLogin, loginUser);
router.get("/me",protect, getMe);
router.put("/update-password",protect,updatePassword);


module.exports = router