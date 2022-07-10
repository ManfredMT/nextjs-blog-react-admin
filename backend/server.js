const express = require("express");
const http = require("http");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const {connectDB, setDefaultPasswd} = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const rateLimit = require('express-rate-limit');


connectDB();

//设置管理员默认账号
setDefaultPasswd();


const app = express();

const httpServer = http.createServer(app);

app.use(cors());


const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutes
	max: 5000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const multer  = require('multer')
const upload = multer()

app.post('/api/upload', upload.any(), (req, res, next) => {
	// req.body contains the text fields
	console.log("upload req file type: ",typeof req.files[0]);
	console.log("upload req files: ",req.files);
	console.log("upload req body: ",req.body);
	res.status(200).json("ok");
  })



app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/users", limiter, require("./routes/userRoutes"));
app.use("/api/links", require("./routes/linkRoutes"));
app.use("/api/posts",require("./routes/postRoutes"));
//app.use("/api/upload", require("./routes/uploadRoutes"));

app.use(errorHandler);



// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
httpServer.listen(port, () => {
  console.log(`HTTP服务器启动,端口为: ${port}`);
});