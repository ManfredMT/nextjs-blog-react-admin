const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const Page = require("../models/pageModel");
const dbName = process.env.DB_NAME;
const nextJsPort = process.env.NEXTJS_PORT;

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
  const name = process.env.USER_NAME;
  const userExists = await User.findOne({ name });

  if (!userExists) {
    const password = process.env.USER_PASSWORD;
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

//设置默认的博客网站信息
const setDefaultProfile = async () => {
  const userName = process.env.USER_NAME;
  const userExists = await User.findOne({ name: userName });
  let profileExists = null;
  if (userExists) {
    profileExists = await Profile.findOne({ user: userExists.id });
  } else {
    throw new Error("初始用户创建失败");
  }
  if (!profileExists) {
    const profileObj = {
      user: userExists.id,
      name: `${userName}的个人博客`,
      title: `${userName}的个人网站`,
      author: "Doe",
      language: "zh-CN",
      siteUrl: `http://localhost:${nextJsPort}`,
      siteRepo: "https://github.com",
      locale: "zh-CN",
      email: "name@site.com",
      description: "个人博客",
      logo: "/api/image/logo.svg",
      avatar: "/api/image/avatar.ico",
      socialBanner: "/api/image/og-image.png",
    };
    try {
      await Profile.create(profileObj);
    } catch (error) {
      throw new Error(error);
    }
  }
};

//设置默认的待构建页面表
const setDefaultPage = async () => {
  const userName = process.env.USER_NAME;
  const userExists = await User.findOne({ name: userName });
  let pageExists = null;
  if (userExists) {
    pageExists = await Page.findOne({ user: userExists.id });
  } else {
    throw new Error("初始用户创建失败");
  }
  if (!pageExists) {
    const pageObj = {
      user: userExists.id,
      pages: [],
    };
    try {
      await Page.create(pageObj);
    } catch (error) {
      throw new Error(error);
    }
  }
};

module.exports = {
  connectDB,
  setDefaultPasswd,
  setDefaultProfile,
  setDefaultPage,
};
