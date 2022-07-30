const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Please add a title to the blog logo"],
  },
  title: {
    type: String,
    required: [true, "Please add a html title"],
  },
  author: {
    type: String,
    required: [true, "Please add a site author"],
  },
  language: {
    type: String,
    required: true,
  },
  siteUrl: {
    type: String,
    required: true,
  },
  siteRepo: {
    type: String,
    required: true,
  },
  locale: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
  },
  email: {
    type: String,
  },
  github: {
    type: String,
  },
  zhihu: {
    type: String,
  },
  juejin: {
    type: String,
  },
  wx: {
    type: String,
  },
  description: {
    type: String,
  },
  logo: {
    type: String,
  },
  logoType: {
    type: String,
  },
  avatar: {
    type: String,
  },
  avatarType: {
    type: String,
  },
  socialBanner: {
    type: String,
  },
  socialBannerType: {
    type: String,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
