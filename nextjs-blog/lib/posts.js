import { connectDB } from "./utils/db";
import Post from "./utils/postModel";
import User from "./utils/userModel";
import dbConnect from "./utils/dbConnect";

export async function getAllPostsData() {
  await dbConnect();
  //connectDB();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.log("用户不存在");
    return [];
  } else {
    const posts = await Post.find({ user: user.id, draft: false }).select(
      "-content -image"
    );
    return JSON.parse(JSON.stringify(posts));
  }
}

export async function getAllTags() {
  await dbConnect();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.log("用户不存在");
    return [];
  } else {
    const tagsFindResult = await Post.find({
      user: user.id,
      draft: false,
    }).select("tags");
    let allTags = [];

    if (tagsFindResult) {
      tagsFindResult.forEach((doc) => {
        doc.tags.forEach((tag) => {
          if (allTags.includes(tag)) {
            const index = allTags.findIndex((t) => t.tagName === tag);
            allTags[index].value += 1;
          } else {
            allTags.push({ tagName: tag, value: 1 });
          }
        });
      });
      return allTags;
    } else {
      return [];
    }
  }
}

export async function getAllCategories() {
  await dbConnect();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.log("用户不存在");
    return [];
  } else {
    const cFindResult = await Post.find({
      user: user.id,
      draft: false,
    }).select("category");
    let allCategories = [];
    if (cFindResult) {
      cFindResult.forEach((doc) => {
        if (!allCategories.includes(doc.category)) {
          allCategories.push(doc.category);
        }
      });
      return allCategories;
    } else {
      return [];
    }
  }
}
