const asyncHandler = require("express-async-handler");

const Profile = require("../models/profileModel");

// @desc   Get profile
// @route  GET /api/profile
// @access Private
const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.find({ user: req.user.id });
  res.status(200).json(profile);
});

// @desc   Update profile
// @route  PUT /api/profile/:id
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findById(req.params.id);
  if (!profile) {
    res.status(400);
    throw new Error("Profile not found");
  }
  //const user = await User.findById(req.user.id)
  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }
  if (profile.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  let newProfileData = req.body;
  //console.log('req.files: ',req.files);

  if (req?.files?.logo && req?.files?.logo[0]) {
    if (req?.files?.logo[0].size > 300000) {
      res.status(400);
      throw new Error("image is too large");
    }
    newProfileData.logo = req.files["logo"][0].buffer;
  }
  if (req?.files?.avatar && req?.files?.avatar[0]) {
    if (req?.files?.avatar[0].size > 300000) {
      res.status(400);
      throw new Error("image is too large");
    }
    newProfileData.avatar = req.files["avatar"][0].buffer;
  }
  if (req?.files?.socialBanner && req?.files?.socialBanner[0]) {
    if (req?.files?.socialBanner[0].size > 300000) {
      res.status(400);
      throw new Error("image is too large");
    }
    newProfileData.socialBanner = req.files["socialBanner"][0].buffer;
  }

  const updatedProfile = await Profile.findByIdAndUpdate(
    req.params.id,
    newProfileData,
    {
      new: true,
    }
  );
  updatedProfile.logo = undefined;
  updatedProfile.avatar = undefined;
  updatedProfile.socialBanner = undefined;
  res.status(200).json(updatedProfile);
});

module.exports = {
  getProfile,
  updateProfile,
};
