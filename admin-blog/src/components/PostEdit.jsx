import {
  Button,
  Form, message as antMessage
} from "antd";
import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import style from "../css/EditPostForm.module.css";
import { getPosts, reset, updatePost } from "../features/posts/postSlice";
import useGetData from "../hooks/useGetData";
import HCenterSpin from "./HCenterSpin";
import MarkDownEditor from "./MarkDownEditor";
import PostForm from "./PostForm";

function getAllAuthors(posts) {
  let AllAuthors = [];
  posts.forEach(({ authors }) => {
    authors.forEach((author) => {
      if (AllAuthors.includes(author) === false) {
        AllAuthors.push(author);
      }
    });
  });
  return AllAuthors.sort();
}

function getUFormDate(values, currentPost) {
  const postFormData = new FormData();
  postFormData.append("title", values.post.title);
  postFormData.append("category", values.post.category);
  values.post.authors.forEach((author) => {
    postFormData.append("authors", author);
  });
  postFormData.append("draft", values.post.draft);
  if (values.post.tags && values.post.tags.length !== 0) {
    values.post.tags.forEach((tag) => {
      postFormData.append("tags", tag);
    });
  } else if (values.post.tags && values.post.tags.length === 0) {
    postFormData.append("tags", "");
  }
  if (values.post.summary) {
    postFormData.append("summary", values.post.summary);
  } else if (currentPost.summary !== "" && values.post.summary === "") {
    postFormData.append("summary", "");
  }
  if (values.post.canonicalUrl) {
    postFormData.append("canonicalUrl", values.post.canonicalUrl);
  } else if (
    currentPost.canonicalUrl !== "" &&
    values.post.canonicalUrl === ""
  ) {
    postFormData.append("canonicalUrl", "");
  }
  if (values.post.content) {
    postFormData.append("content", values.post.content);
  } else if (currentPost.content !== "" && values.post.content === "") {
    postFormData.append("content", "");
  }

  return postFormData;
}

const PostEdit = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const formRef = useRef(null);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const dispatch = useDispatch();
  const { posts, isSuccess, isError, message } = useSelector(
    (state) => state.posts
  );
  const navigate = useNavigate();

  useGetData(getPosts, reset, isError, message);

  useEffect(() => {
    if (isSuccess && message === "文章已更改") {
      antMessage.success(message);
      setSearchParams({});
    }
  }, [isSuccess, message, setSearchParams]);

  const allPosts = useMemo(
    () =>
      posts.map((post) => {
        return {
          id: post._id,
          date: new Date(post.createdAt).toLocaleString(),
          ...post,
        };
      }),
    [posts]
  );

  let allAuthors = getAllAuthors(allPosts);
  allAuthors.splice(
    allAuthors.findIndex((author) => author === "default"),
    1
  );

  const currentPost = allPosts.find(
    (post) => post.id === searchParams.get("edit")
  );

  useEffect(() => {
    if (allPosts.length !== 0) {
      const postIndex = allPosts.findIndex(
        (post) => post.id === searchParams.get("edit")
      );

      if (postIndex === -1) {
        setSearchParams({});
      }
    }
  }, [allPosts, navigate, searchParams, setSearchParams]);

  const onFinishUpdate = (values) => {
    const formValues = values;
    const postFormData = getUFormDate(formValues, currentPost);
    postFormData.append("postId", searchParams.get("edit"));
    dispatch(updatePost(postFormData));
  };
  const renderMDEditor = currentPost ? (
    <Form.Item
      initialValue={currentPost.content ?? null}
      name={["post", "content"]}
      label={isTabletOrMobile ? null : "文章内容"}
      tooltip="MarkDown编辑器, 支持GFM、Katex公式、脚注、代码高亮"
    >
      <MarkDownEditor />
    </Form.Item>
  ) : null;

  return currentPost ? (
    <div className={style["new-form-body"]}>
      <div className={style["link-top-box"]}>
        <Link className={style["link-top"]} to="/manage/post/all-posts">
          {`⬅ 返回文章列表`}
        </Link>
      </div>
      <PostForm
        formRef={formRef}
        onFinish={onFinishUpdate}
        initTitle={currentPost ? currentPost.title : null}
        initAuthors={currentPost ? currentPost.authors : null}
        initCategory={currentPost ? currentPost.category : null}
        hasDraftRadio={true}
        initDraft={currentPost ? currentPost.draft : null}
        initTags={currentPost.tags ?? null}
        initSummary={currentPost.summary ?? null}
        initCanonicalUrl={currentPost.canonicalUrl ?? null}
        renderMDEditor={renderMDEditor}
        posts={posts}
        formClassName={null}
      >
        <Form.Item
          className={style["submit-button-box"]}
          wrapperCol={
            isTabletOrMobile
              ? { span: 12, offset: 8 }
              : { span: 12, offset: 10 }
          }
        >
          <Button
            className={style["submit-button"]}
            type="primary"
            htmlType="submit"
          >
            确认修改
          </Button>
        </Form.Item>
      </PostForm>
    </div>
  ) : (
    <HCenterSpin />
  );
};

export default PostEdit;
