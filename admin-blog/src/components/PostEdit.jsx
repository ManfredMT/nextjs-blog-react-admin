import { InboxOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Form,
  Input,
  message as antMessage,
  Radio,
  Select,
  Spin,
  Upload,
} from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import style from "../css/EditPostForm.module.css";
import { getPosts, reset, updatePost } from "../features/posts/postSlice";
import MarkDownEditor from "./MarkDownEditor";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const validateMessages = {
  required: "${label}不能为空!",
  types: {
    url: "${label}不是有效的链接!",
  },
};

function getAllTags(posts) {
  let AllTags = [];
  posts.forEach(({ tags }) => {
    tags.forEach((tag) => {
      if (AllTags.includes(tag) === false) {
        AllTags.push(tag);
      }
    });
  });
  return AllTags.sort();
}

function getAllCategories(posts) {
  let AllCategories = [];
  posts.forEach(({ category }) => {
    if (!AllCategories.includes(category)) {
      AllCategories.push(category);
    }
  });
  return AllCategories.sort();
}

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
  console.log("values: ", values);
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
  const [blogContent, setBlogContent] = useState("Initial value");
  const onChangeContent = (value) => {
    setBlogContent(value);
  };

  const formRef = useRef(null);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const dispatch = useDispatch();
  const { posts, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.posts
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getPosts());
    return () => {
      dispatch(reset());
    };
  }, []);

  let isErrorReset = useRef(false);
  useEffect(() => {
    if (!isError) {
      isErrorReset.current = true;
    }
    if (isErrorReset.current && isError) {
      antMessage.error(message);
    }
  }, [isError, message]);

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
  const allTags = getAllTags(allPosts);
  const allCategories = getAllCategories(allPosts);
  let allAuthors = getAllAuthors(allPosts);
  allAuthors.splice(
    allAuthors.findIndex((author) => author === "default"),
    1
  );
  const categoryOptions = allCategories.map((c) => {
    return { value: c };
  });

  const currentPost = allPosts.find(
    (post) => post.id === searchParams.get("edit")
  );
  console.log(
    "current post: ",
    currentPost,
    currentPost ?? currentPost?.tags.length === 0 ? null : currentPost?.tags
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

  return currentPost ? (
    <div className={style["new-form-body"]}>
      <div className={style["link-top-box"]}>
        <Link className={style["link-top"]} to="/manage/post/all-posts">
          {`⬅ 返回文章列表`}
        </Link>
      </div>
      <Form
        ref={formRef}
        labelCol={
          isTabletOrMobile
            ? null
            : {
                span: 2,
              }
        }
        wrapperCol={
          isTabletOrMobile
            ? null
            : {
                span: 21,
              }
        }
        layout={isTabletOrMobile ? "vertical" : null}
        name="nest-messages"
        validateMessages={validateMessages}
        onFinish={onFinishUpdate}
      >
        <Form.Item
          name={["post", "title"]}
          label="文章标题"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={currentPost ? currentPost.title : null}
        >
          <Input
            onPressEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            placeholder={isTabletOrMobile ? "文章标题(必填)" : null}
          />
        </Form.Item>

        <Form.Item
          name={["post", "authors"]}
          label="作者"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={currentPost ? currentPost.authors : null}
        >
          <Select mode="tags">
            {allAuthors.map((author, i) => {
              return <Select.Option key={author}>{author}</Select.Option>;
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name={["post", "category"]}
          label="分类"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={currentPost ? currentPost.category : null}
        >
          <AutoComplete
            allowClear
            options={categoryOptions}
            className={style["item-select"]}
          />
        </Form.Item>

        <Form.Item
          name={["post", "draft"]}
          label="是否为草稿"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={currentPost ? currentPost.draft : null}
        >
          <Radio.Group>
            <Radio value={true}>草稿</Radio>
            <Radio value={false}>博客文章</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          initialValue={currentPost.tags ?? null}
          name={["post", "tags"]}
          label="标签"
        >
          <Select
            mode="tags"
            placeholder={isTabletOrMobile ? "标签(可选)" : null}
          >
            {allTags.map((tag, i) => {
              return <Select.Option key={tag}>{tag}</Select.Option>;
            })}
          </Select>
        </Form.Item>
        <Form.Item
          initialValue={currentPost.summary ?? null}
          name={["post", "summary"]}
          label="文章提要"
        >
          <Input.TextArea
            //placeholder="文章提要"
            placeholder={isTabletOrMobile ? "文章提要(可选)" : null}
            autoSize={{ minRows: 2 }}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          initialValue={currentPost.canonicalUrl ?? null}
          name={["post", "canonicalUrl"]}
          label="标准链接"
          rules={[
            {
              type: "url",
            },
          ]}
          tooltip="表示该博客唯一的标准规范URL,用于搜索引擎优化"
        >
          <Input
            onPressEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            placeholder={isTabletOrMobile ? "标准链接(可选)" : null}
          />
        </Form.Item>

        <Form.Item
          initialValue={currentPost.content ?? null}
          name={["post", "content"]}
          label={isTabletOrMobile ? null : "文章内容"}
          tooltip="MarkDown编辑器, 支持GFM、Katex公式、脚注、代码高亮"
        >
          <MarkDownEditor
          //value={blogContent}
          //onChange={onChangeContent}
          />
        </Form.Item>

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
            //onClick={handleUpdatePost}
          >
            确认修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  ) : (
    <Spin className={style["spin-center"]} indicator={antIcon} />
  );
};

export default PostEdit;
