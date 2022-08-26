import { Button, Form, message as antMessage } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import style from "../css/EditPostForm.module.css";
import { createPost, getPosts, reset, resetError } from "../features/posts/postSlice";
import useGetData from "../hooks/useGetData";
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

function getFormDate(values, blogContent) {
  const postFormData = new FormData();
  postFormData.append("title", values.post.title);
  postFormData.append("category", values.post.category);
  values.post.authors.forEach((author) => {
    postFormData.append("authors", author);
  });
  if (values.post.tags && values.post.tags.length !== 0) {
    values.post.tags.forEach((tag) => {
      postFormData.append("tags", tag);
    });
  } else if (values.post.tags && values.post.tags.length === 0) {
    postFormData.append("tags", "");
  }
  if (values.post.summary) {
    postFormData.append("summary", values.post.summary);
  }
  if (values.post.canonicalUrl) {
    postFormData.append("canonicalUrl", values.post.canonicalUrl);
  }
  if (blogContent) {
    postFormData.append("content", blogContent);
  }

  return postFormData;
}

const NewPost = () => {
  const mdeId = "blog";

  const autosavedValue = localStorage.getItem(`smde_${mdeId}`) || "";
  const [blogContent, setBlogContent] = useState(autosavedValue);

  const onChangeContent = (value) => {
    setBlogContent(value);
  };

  const dispatch = useDispatch();
  const { posts, isSuccess, isError, message } = useSelector(
    (state) => state.posts
  );
  useGetData(getPosts, reset, isError, message, resetError);

  useEffect(() => {
    if (
      isSuccess &&
      (message === "成功保存草稿" || message === "成功发布文章")
    ) {
      antMessage.success(message);
      formRef.current.resetFields();
    }
  }, [isSuccess, message]);

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

  const formRef = useRef(null);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const isDraft = useRef(true);
  const onClickPublish = (e) => {
    isDraft.current = false;
  };

  const handleSaveDraft = (e) => {
    isDraft.current = true;
  };

  const onFinishNewPost = (values) => {
    //console.log("onFinishNewPost: ", values);
    const formValues = values;
    const postFormData = getFormDate(formValues, blogContent);
    postFormData.append("draft", isDraft.current);
    dispatch(createPost(postFormData));
  };

  const renderMDEditor = (
    <Form.Item
      label={isTabletOrMobile ? null : "文章内容"}
      tooltip="MarkDown编辑器, 支持GFM、Katex公式、脚注、代码高亮"
    >
      <MarkDownEditor
        id={mdeId}
        autoSave={true}
        value={blogContent}
        onChange={onChangeContent}
      />
    </Form.Item>
  );

  return (
    <PostForm
      formRef={formRef}
      onFinish={onFinishNewPost}
      initTitle={null}
      initAuthors={["default"]}
      initCategory={"default"}
      hasDraftRadio={false}
      initDraft={null}
      initSummary={null}
      initCanonicalUrl={null}
      renderMDEditor={renderMDEditor}
      posts={posts}
      formClassName={style["new-form-body"]}
    >
      <Form.Item
        className={style["submit-button-box"]}
        wrapperCol={
          isTabletOrMobile ? { span: 12, offset: 4 } : { span: 12, offset: 10 }
        }
      >
        <Button
          className={style["submit-button"]}
          type="primary"
          htmlType="submit"
          onClick={onClickPublish}
        >
          发布文章
        </Button>
        <Button
          type="primary"
          className={style["second-button"]}
          htmlType="submit"
          onClick={handleSaveDraft}
        >
          存为草稿
        </Button>
      </Form.Item>
    </PostForm>
  );
};

export default NewPost;
