const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const dbName = "blog";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: dbName,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//设置管理员默认账号
const setDefaultPasswd = async () => {
  const name = "admin";
  const userExists = await User.findOne({ name });

  if (!userExists) {
    const password = "admin";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      password: hashedPassword,
    });
    if (user) {
      console.log(`初始化密码设置成功`);
    } else {
      throw new Error("初始化密码设置失败");
    }
  }
};

module.exports = { connectDB, setDefaultPasswd };