const express = require("express");
const http = require("http");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const {
  connectDB,
  setDefaultPasswd,
  setDefaultProfile,
} = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

connectDB();

//设置管理员默认账号
setDefaultPasswd().then(()=>setDefaultProfile());


const app = express();

const httpServer = http.createServer(app);

app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const limiterComment = rateLimit({
  windowMs: 20 * 60 * 1000, // ms
  max: 500, // Limit each IP to xx requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const multer  = require('multer')
// const upload = multer()

// app.post('/api/upload', upload.any(), (req, res, next) => {
// req.body contains the text fields
// console.log("upload req file type: ",typeof req.files[0]);
// console.log("upload req files: ",req.files);
// console.log("upload req body: ",req.body);
// 	res.status(200).json("ok");
//   })

app.use("/api/users", limiter, require("./routes/userRoutes"));
app.use("/api/links", limiter, require("./routes/linkRoutes"));
app.use("/api/posts", limiter, require("./routes/postRoutes"));
app.use("/api/profile", limiter, require("./routes/profileRoutes"));
app.use("/api/comments", limiterComment, require("./routes/commentRoutes"));

app.use(errorHandler);

//Serving static image files
const limiterStatic = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 200, // Limit each IP to 150 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const path = require("path");
app.use(
  "/api/image",
  limiterStatic,
  express.static(path.join(__dirname, "uploads/image"))
);

//博客管理页面的静态服务器
if (process.env.NODE_ENV === "production") {
  const expressStaticGzip = require("express-static-gzip");
  app.use(
    limiterStatic,
    expressStaticGzip(path.join(__dirname, "../admin-blog/build"))
  );
  app.get("/*", limiterStatic, function (req, res) {
    res.sendFile(path.join(__dirname, "../admin-blog/build", "index.html"));
  });
}

// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
httpServer.listen(port, () => {
  console.log(`HTTP服务器启动,端口为: ${port}`);
});
