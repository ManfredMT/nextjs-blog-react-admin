const asyncHandler = require("express-async-handler");

const handleDemoReq = asyncHandler(async (req, res, next) => {
  if (process.env.DEMO === 0) {
    next();
  } else {
    res.status(403);
    throw new Error("演示环境无法修改数据");
  }
});

module.exports = { handleDemoReq };
