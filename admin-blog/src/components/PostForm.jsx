import {
  AutoComplete,
  Form,
  Input,
  message as antMessage,
  Radio,
  Select,
} from "antd";
import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import style from "../css/EditPostForm.module.css";

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
function PostForm({
  formRef,
  formClassName,
  onFinish,
  initTitle,
  initAuthors,
  initCategory,
  hasDraftRadio,
  initDraft,
  initTags,
  initSummary,
  initCanonicalUrl,
  renderMDEditor,
  posts,
  children,
}) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const onFinishFailed = () => {
    antMessage.error("表单错误，请修改表单");
  };

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

  return (
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
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className={formClassName}
    >
      <Form.Item
        name={["post", "title"]}
        label="文章标题"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={initTitle}
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
        initialValue={initAuthors}
        tooltip={"当作者为'default'时,代表博客设置中的网页作者"}
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
        initialValue={initCategory}
      >
        <AutoComplete
          //不起作用?
          // onPressEnter={(e) => {
          //     e.preventDefault();
          //     e.stopPropagation();
          //   }}
          allowClear
          options={categoryOptions}
          className={style["item-select"]}
        />
      </Form.Item>

      {hasDraftRadio ? (
        <Form.Item
          name={["post", "draft"]}
          label="是否为草稿"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={initDraft}
        >
          <Radio.Group>
            <Radio value={true}>草稿</Radio>
            <Radio value={false}>博客文章</Radio>
          </Radio.Group>
        </Form.Item>
      ) : null}

      <Form.Item initialValue={initTags} name={["post", "tags"]} label="标签">
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
        initialValue={initSummary}
        name={["post", "summary"]}
        label="文章简介"
      >
        <Input.TextArea
          onPressEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          placeholder={isTabletOrMobile ? "文章简介(可选)" : null}
          autoSize={{ minRows: 2 }}
          showCount
          maxLength={500}
        />
      </Form.Item>

      <Form.Item
        initialValue={initCanonicalUrl}
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

      {renderMDEditor}

      {children}
    </Form>
  );
}

export default PostForm;
