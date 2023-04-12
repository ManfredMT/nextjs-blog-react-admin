
import Post from "./utils/postModel";
import User from "./utils/userModel";
import Page from "./utils/pageModel";
import dbConnect from "./utils/dbConnect";

export async function getAllPostsData() {
  await dbConnect();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.error("用户不存在");
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
    console.error("用户不存在");
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
          const index = allTags.findIndex((t) => t.tagName === tag);
          if (index !== -1) {
            allTags[index].value += 1;
          } else {
            allTags.push({ tagName: tag, value: 1 });
          }
        });
      });
      allTags.sort((a,b)=>{
        return b.value - a.value;
      })
      return allTags;
    } else {
      return [];
    }
  }
}

export async function getPostsByTag(tagName) {
  await dbConnect();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.error("用户不存在");
    return [];
  } else {
    const tagsFindResult = await Post.find({
      user: user.id,
      draft: false,
      tags: tagName,
    }).select("-content -image");
    if (tagsFindResult) {
      return JSON.parse(JSON.stringify(tagsFindResult));
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
    console.error("用户不存在");
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

export async function getPostsByCategory(categoryName) {
  await dbConnect();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.error("用户不存在");
    return [];
  } else {
    const cFindResult = await Post.find({
      user: user.id,
      draft: false,
      category: categoryName,
    }).select("-content -image");
    if (cFindResult) {
      return JSON.parse(JSON.stringify(cFindResult));
    } else {
      return [];
    }
  }
}

export async function getPostById(postId) {
  await dbConnect();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.error("用户不存在");
    return [];
  } else {
    const postsResult = await Post.find({
      user: user.id,
      draft: false,
      _id: postId,
    }).select("-image");

    if (postsResult) {
      //console.log("lib postsResult: ", postsResult);
      return JSON.parse(JSON.stringify(postsResult));
    } else {
      return [];
    }
  }
}

export async function getAllPostIds() {
  await dbConnect();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.error("用户不存在");
    return [];
  } else {
    const postsResult = await Post.find({
      user: user.id,
      draft: false,
    }).select("_id");
    if (postsResult) {
      const paths = postsResult.map((doc) => {
        return {
          params: {
            id: doc._id.toString(),
          },
        };
      });
      return paths;
    } else {
      return null;
    }
  }
}

export async function getAllPostTitles() {
  await dbConnect();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.error("用户不存在");
    return [];
  } else {
    const postsResult = await Post.find({
      user: user.id,
      draft: false,
    }).select("title");
    if (postsResult) {
      const paths = postsResult.map((doc) => {
        return {
          params: {
            slug: doc.title,
          },
        };
      });
      return paths;
    } else {
      return null;
    }
  }
}

export async function getPostByTitle(title) {
  await dbConnect();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.error("用户不存在");
    return [];
  } else {
    const postsResult = await Post.find({
      user: user.id,
      draft: false,
      title: title,
    }).select("-image");
    const allPostTitle = await Post.find({
      user: user.id,
      draft: false,
    }).select("title createdAt");

    if (postsResult.length && allPostTitle.length) {
      const allPostTitleObj = JSON.parse(JSON.stringify(allPostTitle));
      const sortedTitles = allPostTitleObj.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const sortTIndex = sortedTitles.findIndex((p) => p.title === title);
      const postsObj = JSON.parse(JSON.stringify(postsResult));
      postsObj[0].nextPost = sortedTitles[sortTIndex + 1]?.title ?? null;
      postsObj[0].lastPost = sortedTitles[sortTIndex - 1]?.title ?? null;
      return postsObj;
    } else {
      return [];
    }
  }
}

export async function getPostRelatedPath() {
  await dbConnect();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.error("用户不存在");
    return [];
  } else {
    const pageDoc = await Page.findOne({user: user.id});
    const postRelatedPath = [...pageDoc.pages];
    await Page.findOneAndUpdate({user: user.id},{pages:[]});
    return postRelatedPath;
  }
}


export async function getMonthArchive() {
  await dbConnect();
  const name = process.env.USER_NAME;
  const user = await User.findOne({ name });
  if (!user) {
    console.error("用户不存在");
    return [];
  } else {
    const posts = await Post.find({ user: user.id, draft: false }).sort({createdAt: -1}).select(
      "-content -image"
    );
    if (posts) {
      const monthList = [];
      const monthArchive = [];
      posts.forEach((doc) => {
        const createdDate = new Date(doc.createdAt);
        const formatCreated = `${
          createdDate.getMonth() + 1
        }月, ${createdDate.getFullYear()}`;
        if (!monthList.includes(formatCreated)) {
          const postArchive = {
            date: formatCreated,
            posts: [{ id: doc._id.toString(), title: doc.title }],
          };
          monthArchive.push(postArchive);
          monthList.push(formatCreated);
        } else {
          const archiveIndex = monthArchive.findIndex(
            (a) => a.date === formatCreated
          );
          if(archiveIndex!==-1) {
            monthArchive[archiveIndex].posts.push({
            id: doc._id.toString(),
            title: doc.title,
          });
          }
        }
      });
      return monthArchive;
    }
  }
}


