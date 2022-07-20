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
  if (req.file) {
    newProfileData.logo = req.file.buffer;
  }
  const updatedProfile = await Profile.findByIdAndUpdate(
    req.params.id,
    newProfileData,
    {
      new: true,
    }
  );
  updatedProfile.logo = undefined;
  res.status(200).json(updatedProfile);
});



module.exports = {
  getProfile,
  updateProfile,
};