const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc   Register new user
// @route  POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400);
    throw new Error("请填写完整信息");
  }

  const userExists = await User.findOne({ name });

  if (userExists) {
    res.status(400);
    throw new Error("用户已存在");
  }

  console.log(`申请注册新用户：用户名：(${name})`);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(`申请注册新用户：用户名：(${name}),密码哈希成功`);

  const user = await User.create({
    name,
    password: hashedPassword,
  });

  console.log(`用户名：(${name})，user：${user}`);
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      token: generateToken(user._id),
    });
    console.log(`新用户注册成功，用户名为${user.name}`);
  } else {
    res.status(400);
    throw new Error("用户注册失败");
  }
});

// @desc   Authenticate a user
// @route  POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  //console.log("login from: ",req.ip);
  if(!req.body.password) {
    res.status(400);
    throw new Error("请提供密码");
  }
  if(typeof req.body.password !== 'string') {
    res.status(400);
    throw new Error("密码类型错误");
  }
  const { password } = req.body;
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("密码错误");
  }
});

// @desc   Get user data
// @route  GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc   Update user password
// @route  PUT /api/users/update-password
// @access Private
const updatePassword = asyncHandler(async (req, res) => {
  const { origin, password } = req.body;

  if (!origin || !password) {
    res.status(400);
    throw new Error("请填写完整信息");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }

  const user = await User.findOne({ name: req.user.name });
  if (!user) {
    res.status(400);
    throw new Error("User not founded");
  }
  if (!(await bcrypt.compare(origin, user.password))) {
    res.status(400);
    throw new Error("密码错误");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { password: hashedPassword },
    {
      new: true,
    }
  );

  if (updatedUser) {
    res.status(200).json({
      _id: updatedUser.id,
      name: updatedUser.name,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(400);
    throw new Error("密码更改失败");
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
};

module.exports = { loginUser, getMe, updatePassword };
