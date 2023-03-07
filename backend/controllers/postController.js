const asyncHandler = require("express-async-handler");

const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const Page = require("../models/pageModel");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const revalidateUrl = `http://localhost:${process.env.NEXTJS_PORT}/api/revalidate?secret=${process.env.MY_SECRET_TOKEN}&change=post`;

// @desc   Get Posts
// @route  GET /api/posts
// @access Private
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ user: req.user.id }).select("-image");
  res.status(200).json(posts);
});

// @desc   Get one Post
// @route  GET /api/posts/:id
// @access Private
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(400);
    throw new Error("Post not found");
  }
  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }
  if (post.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  post.image = undefined;
  res.status(200).json(post);
});

// @desc   Set Posts
// @route  POST /api/posts
// @access Private
const setPosts = asyncHandler(async (req, res) => {
  if (!req.body.category) {
    res.status(400);
    throw new Error("Please add a category");
  }
  if (!req.body.draft) {
    res.status(400);
    throw new Error("Please set draft value");
  }
  if (!req.body.authors) {
    res.status(400);
    throw new Error("Please add authors to the post");
  }
  if (!req.body.title) {
    res.status(400);
    throw new Error("Please add a title to the post");
  } else {
    const postExists = await Post.findOne({ title: req.body.title });
    if (postExists) {
      res.status(400);
      throw new Error("文章已存在");
    }
  }

  let postObj = {
    user: req.user.id,
    title: req.body.title,
    draft: req.body.draft,
    authors: req.body.authors,
    category: req.body.category,
  };
  if (req.body.tags) {
    postObj.tags = req.body.tags;
  }
  if (req.body.summary) {
    postObj.summary = req.body.summary;
  }
  if (req.body.canonicalUrl) {
    postObj.canonicalUrl = req.body.canonicalUrl;
  }
  if (req.body.content) {
    postObj.content = req.body.content;
  }
  if (req.file) {
    //console.log("image and type: ", req.file, typeof req.file);
    postObj.image = req.file.buffer;
  }
  try {
    const post = await Post.create(postObj);
    post.image = undefined;
    // 待构建页面
    const pages = [
      "/",
      "/timeline",
      "/categories",
      "/tags",
      "/categories/" + req.body.category,
      "/posts/" + req.body.title,
    ];
    if (req.body.tags) {
      const tags = req.body.tags;
      //console.log("debug tags:", tags, typeof tags === "string");
      if (typeof tags === "string") {
        pages.push("/tags/" + tags);
      } else {
        tags.forEach((tag) => {
          pages.push("/tags/" + tag);
        });
      }
    }

    const allPostTitle = await Post.find({
      user: req.user.id,
      draft: false,
    }).select("title createdAt");
    if (allPostTitle.length) {
      const allPostTitleObj = JSON.parse(JSON.stringify(allPostTitle));
      const sortedTitles = allPostTitleObj.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const sortTIndex = sortedTitles.findIndex(
        (p) => p.title === req.body.title
      );
      const nextPost = sortedTitles[sortTIndex + 1]?.title ?? null;
      const lastPost = sortedTitles[sortTIndex - 1]?.title ?? null;
      if (nextPost) {
        pages.push("/posts/" + nextPost);
      }
      if (lastPost) {
        pages.push("/posts/" + lastPost);
      }
    }

    const pageDoc = await Page.findOne({ user: req.user.id });
    const mergePages = [...pages, ...pageDoc.pages];
    const deDupPages = [...new Set(mergePages)];
    await Page.findOneAndUpdate({ user: req.user.id }, { pages: deDupPages });
    // console.log("pages: ",deDupPages);

    res.status(200).json(post);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  } finally {
    await fetch(revalidateUrl);
  }
});

// @desc   Update posts
// @route  PUT /api/posts/:id
// @access Private
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(400);
    throw new Error("Post not found");
  }
  //const user = await User.findById(req.user.id)
  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }
  if (post.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  let newPostData = req.body;
  if (req.file) {
    newPostData.image = req.file.buffer;
  }
  //console.log("req.body.tags: ",req.body.tags, typeof req.body.tags)
  if (req.body.tags === "") {
    //console.log("set empty array to tags")
    newPostData.tags = [];
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      newPostData,
      {
        new: true,
      }
    );
    updatedPost.image = undefined;

    const pages = [
      "/",
      "/timeline",
      "/categories",
      "/tags",
      "/categories/" + updatedPost.category,
      "/categories/" + post.category,
      "/posts/" + updatedPost.title,
    ];
    post.tags.forEach((tag) => {
      pages.push("/tags/" + tag);
    });
    updatedPost.tags.forEach((tag) => {
      pages.push("/tags/" + tag);
    });

    const allPostTitle = await Post.find({
      user: req.user.id,
      draft: false,
    }).select("title createdAt");
    if (allPostTitle.length) {
      const allPostTitleObj = JSON.parse(JSON.stringify(allPostTitle));
      const sortedTitles = allPostTitleObj.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const sortTIndex = sortedTitles.findIndex(
        (p) => p.title === updatedPost.title
      );
      const nextPost = sortedTitles[sortTIndex + 1]?.title ?? null;
      const lastPost = sortedTitles[sortTIndex - 1]?.title ?? null;
      if (nextPost) {
        pages.push("/posts/" + nextPost);
      }
      if (lastPost) {
        pages.push("/posts/" + lastPost);
      }
    }

    const pageDoc = await Page.findOne({ user: req.user.id });
    const mergePages = [...pages, ...pageDoc.pages];
    const deDupPages = [...new Set(mergePages)];
    await Page.findOneAndUpdate({ user: req.user.id }, { pages: deDupPages });
    //console.log("pages: ",deDupPages);

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  } finally {
    await fetch(revalidateUrl);
  }
});

// @desc   Delete Posts
// @route  DELETE /api/posts/:id
// @access Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(400);
    throw new Error("Post not found");
  }

  //const user = await User.findById(req.user.id)

  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }

  if (post.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  try {
    const pages = [
      "/",
      "/timeline",
      "/categories",
      "/tags",
      "/categories/" + post.category,
      "/posts/" + post.title,
    ];
    post.tags.forEach((tag) => {
      pages.push("/tags/" + tag);
    });

    const allPostTitle = await Post.find({
      user: req.user.id,
      draft: false,
    }).select("title createdAt");
    if (allPostTitle.length) {
      const allPostTitleObj = JSON.parse(JSON.stringify(allPostTitle));
      const sortedTitles = allPostTitleObj.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const sortTIndex = sortedTitles.findIndex(
        (p) => p.title === post.title
      );
      const nextPost = sortedTitles[sortTIndex + 1]?.title ?? null;
      const lastPost = sortedTitles[sortTIndex - 1]?.title ?? null;
      if (nextPost) {
        pages.push("/posts/" + nextPost);
      }
      if (lastPost) {
        pages.push("/posts/" + lastPost);
      }
    }

    const pageDoc = await Page.findOne({ user: req.user.id });
    const mergePages = [...pages, ...pageDoc.pages];
    const deDupPages = [...new Set(mergePages)];
    await Page.findOneAndUpdate({ user: req.user.id }, { pages: deDupPages });
    //console.log("pages: ", deDupPages);

    await Comment.deleteMany({ post: req.params.id });
    await post.remove();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  } finally {
    await fetch(revalidateUrl);
  }
});

// @desc   Update category
// @route  PUT /api/posts/category
// @access Private
const updateCategory = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }
  if (!req.body.oldCategory) {
    res.status(400);
    throw new Error("Please set the category that needs to be changed");
  }
  if (!req.body.newCategory) {
    res.status(400);
    throw new Error("Please set a new category");
  }
  const oldCategory = req.body.oldCategory;
  if (oldCategory === "default") {
    res.status(400);
    throw new Error("Can not change default category");
  }
  const newCategory = req.body.newCategory;
  try {
    const updateManyCategory = await Post.updateMany(
      {
        user: req.user.id,
        category: oldCategory,
      },
      {
        category: newCategory,
      }
    );

    const pages = [
      "/categories",
      "/categories/" + oldCategory,
      "/categories/" + newCategory,
    ];
    const posts = await Post.find({
      user: req.user.id,
      draft: false,
      category: newCategory,
    });
    posts.forEach((doc) => {
      pages.push("/posts/" + doc.title);
    });

    const pageDoc = await Page.findOne({ user: req.user.id });
    const mergePages = [...pages, ...pageDoc.pages];
    const deDupPages = [...new Set(mergePages)];
    await Page.findOneAndUpdate({ user: req.user.id }, { pages: deDupPages });
    //console.log("pages: ", deDupPages);

    res.status(200).json(updateManyCategory);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  } finally {
    await fetch(revalidateUrl);
  }
});

// @desc   Update tag
// @route  PUT /api/posts/tag
// @access Private
const updateTag = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }
  if (!req.body.oldTag) {
    res.status(400);
    throw new Error("Please set the tag that needs to be changed");
  }
  if (!req.body.newTag) {
    res.status(400);
    throw new Error("Please set a new tag");
  }
  const oldTag = req.body.oldTag;
  const newTag = req.body.newTag;
  try {
    const updateManyTag = await Post.updateMany(
      {
        user: req.user.id,
        tags: oldTag,
      },
      {
        "tags.$": newTag,
      }
    );

    const pages = ["/", "/tags", "/tags/" + oldTag, "/tags/" + newTag];
    const posts = await Post.find({
      user: req.user.id,
      draft: false,
      tags: newTag,
    });
    posts.forEach((doc) => {
      pages.push("/posts/" + doc.title);
    });

    const pageDoc = await Page.findOne({ user: req.user.id });
    const mergePages = [...pages, ...pageDoc.pages];
    const deDupPages = [...new Set(mergePages)];
    await Page.findOneAndUpdate({ user: req.user.id }, { pages: deDupPages });
    //console.log("pages: ", deDupPages);

    res.status(200).json(updateManyTag);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  } finally {
    await fetch(revalidateUrl);
  }
});

// @desc   Delete tag
// @route  Delete /api/posts/tag
// @access Private
const deleteTag = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }
  if (!req.body.tag) {
    res.status(400);
    throw new Error("Please set the tag that needs to be deleted");
  }
  const tag = req.body.tag;
  try {
    const pages = ["/", "/tags", "/tags/" + tag];
    const posts = await Post.find({
      user: req.user.id,
      draft: false,
      tags: tag,
    });
    posts.forEach((doc) => {
      pages.push("/posts/" + doc.title);
    });

    const pageDoc = await Page.findOne({ user: req.user.id });
    const mergePages = [...pages, ...pageDoc.pages];
    const deDupPages = [...new Set(mergePages)];
    await Page.findOneAndUpdate({ user: req.user.id }, { pages: deDupPages });
    //console.log("pages: ", deDupPages);

    const updateManyTag = await Post.updateMany(
      {
        user: req.user.id,
        tags: tag,
      },
      {
        $pull: { tags: tag },
      }
    );
    res.status(200).json(updateManyTag);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  } finally {
    await fetch(revalidateUrl);
  }
});

module.exports = {
  getPosts,
  setPosts,
  updatePost,
  deletePost,
  updateCategory,
  updateTag,
  deleteTag,
  getPostById,
};
