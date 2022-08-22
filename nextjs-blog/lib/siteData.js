import dbConnect from "./utils/dbConnect";
import User from "./utils/userModel";
import Profile from "./utils/profileModel";

export async function getSiteMetadata() {
  await dbConnect();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.error("用户不存在");
    return [];
  } else {
    const profileResult = await Profile.find({ user: user.id });
    let siteMetadata = {};
    if (profileResult.length === 1) {
      profileResult.forEach((doc) => {
        siteMetadata.id = doc._id.toString();
        siteMetadata.name = doc.name;
        siteMetadata.title = doc.title;
        siteMetadata.author = doc.author;
        siteMetadata.language = doc.language;
        siteMetadata.siteUrl = doc.siteUrl;
        siteMetadata.siteRepo = doc.siteRepo;
        siteMetadata.locale = doc.locale;
        siteMetadata.description = doc.description;
        siteMetadata.email = doc.email;
        siteMetadata.logo = doc.logo;
        siteMetadata.avatar = doc.avatar;
        siteMetadata.socialBanner = doc.socialBanner;
        if (doc.keywords) {
          siteMetadata.keywords = doc.keywords;
        }
        if (doc.github) {
          siteMetadata.github = doc.github;
        }
        if (doc.zhihu) {
          siteMetadata.zhihu = doc.zhihu;
        }
        if (doc.juejin) {
          siteMetadata.juejin = doc.juejin;
        }
        if (doc.wx) {
          siteMetadata.wx = doc.wx;
        }
      });
    }

    return siteMetadata;
  }
}
