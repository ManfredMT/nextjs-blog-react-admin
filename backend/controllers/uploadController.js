const asyncHandler = require("express-async-handler");

// @desc   Upload files
// @route  POST /api/upload
// @access Public
const uploadFile = asyncHandler(async (req, res) => {
    // console.log("upload req body: ",req.body);
    // console.log("upload req files: ",req.files);
    res.status(200).json("ok");
  
  });

  module.exports = { uploadFile }
