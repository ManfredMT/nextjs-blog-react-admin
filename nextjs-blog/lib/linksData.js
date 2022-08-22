import dbConnect from "./utils/dbConnect";
import Link from "./utils/linkModel";
import User from "./utils/userModel";

export async function getAllLinksData() {
  await dbConnect();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.error("用户不存在");
    return [];
  } else {
    const linksResult = await Link.find({ user: user.id });
    const allLinks = [];
    if (linksResult) {
      linksResult.forEach((doc) => {
        const linkObj = {id:doc._id.toString(),
            name:doc.name,
            website:doc.website,};
        if(doc.description) {
            linkObj.description = doc.description;
        }
        if(doc.picture) {
            linkObj.picture = doc.picture;
        }
        
        allLinks.push(linkObj);
      });
      return allLinks;
    } else {
      return [];
    }
  }
}
