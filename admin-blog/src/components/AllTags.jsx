import {
  DeleteFilled,
  EditFilled, TagOutlined
} from "@ant-design/icons";
import {
  Form, message as antMessage,
  Popconfirm, Typography
} from "antd";
import { useEffect, useMemo, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import style from "../css/AllItems.module.css";
import {
  deleteTag,
  getPosts,
  reset,
  updateTag,
  resetError
} from "../features/posts/postSlice";
import useColumnSearch from "../hooks/useColumnSearch";
import useGetData from "../hooks/useGetData";
import EditableTable from "./EditableTable";
import HCenterSpin from "./HCenterSpin";

function getTagCount(posts) {
  let tagCount = [];
  posts.forEach(({ tags }) => {
    tags.forEach((tag) => {
      const index = tagCount.findIndex((t) => t.tagName === tag);
      if (index === -1) {
        tagCount.push({ key: tag, tagName: tag, postNumber: 1 });
      } else {
        tagCount[index].postNumber += 1;
      }
    });
  });
  return tagCount;
}

function AllTags() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { posts, isSuccess, isError, isLoadEnd, message } = useSelector(
    (state) => state.posts
  );

  useGetData(getPosts, reset, isError, message, resetError);

  useEffect(() => {
    if (isSuccess && (message === "标签已更改" || message === "标签已删除")) {
      antMessage.success(message);
      dispatch(getPosts());
    }
  }, [isSuccess, message, dispatch]);

  const allPosts = useMemo(
    () =>
      posts
        .filter(({ draft }) => draft === false)
        .map((post) => {
          return {
            id: post._id,
            date: new Date(post.createdAt).toLocaleString(),
            ...post,
          };
        }),
    [posts]
  );

  const originData = getTagCount(allPosts);

  const data = useMemo(() => originData, [originData]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      tagName: "",
      postNumber: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      let tagFormData = new FormData();
      tagFormData.append("oldTag", key);
      tagFormData.append("newTag", row.tagName);
      dispatch(updateTag(tagFormData));
      setEditingKey("");
    } catch (errInfo) {
      console.error("数据错误:", errInfo);
    }
  };

  const handleDelete = (key) => {
    let tagFormData = new FormData();
    tagFormData.append("tag", key);
    dispatch(deleteTag(tagFormData));
  };

  //实现一个搜索列
  const inputPlaceholder = "搜索标签名";
  const renderColumn = (text, dataIndex, searchedColumn, searchText) =>
  searchedColumn === dataIndex ? (
    <>
      <Link to={`../post-tags?tag=${text}`}>
        <TagOutlined />{" "}
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      </Link>
    </>
  ) : (
    <>
      <Link to={`../post-tags?tag=${text}`}>
        <TagOutlined />
        {` ${text}`}
      </Link>
    </>
  );
  const getColumnSearchProps = useColumnSearch(inputPlaceholder,renderColumn);

  const columns = [
    {
      title: "标签名",
      dataIndex: "tagName",
      width: isTabletOrMobile ? "45%" : "65%",
      editable: true,
      sortDirections: ["descend"],
      sorter: (a, b) => a.tagName.toUpperCase() < b.tagName.toUpperCase(),

      ...getColumnSearchProps("tagName"),
    },
    {
      title: "文章数量",
      dataIndex: "postNumber",
      width: isTabletOrMobile ? "25%" : "10%",
      editable: false,
      sorter: (a, b) => a.postNumber - b.postNumber,
    },

    {
      title: "操作",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </Typography.Link>

            <Typography.Link onClick={cancel}>取消</Typography.Link>
          </span>
        ) : isTabletOrMobile ? (
          <>
            <Typography.Link
              className={style["edit-button"]}
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              编辑
            </Typography.Link>
            {data.length >= 1 ? (
              <Popconfirm
              className={style["delete-button-mobile"]}
                okText="确认"
                cancelText="取消"
                title="确认删除标签?"
                onConfirm={() => handleDelete(record.key)}
              >
                <button className={style["no-style-button"]}>删除</button>
              </Popconfirm>
            ) : null}
          </>
        ) : (
          <>
            <Typography.Link
              className={style["edit-button-desktop"]}
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <div className={style["edit-button-desktop-box"]}>
                <EditFilled /> 编辑
              </div>
            </Typography.Link>
            {data.length >= 1 ? (
              <Popconfirm
                className={style["delete-button-desktop"]}
                okText="确认"
                cancelText="取消"
                title="确认删除标签?"
                onConfirm={() => handleDelete(record.key)}
              >
                <button className={style["no-style-button"]}>
                  <DeleteFilled /> 删除
                </button>
              </Popconfirm>
            ) : null}
          </>
        );
      },
    },
  ];

  return isLoadEnd ? (
    <EditableTable
      form={form}
      data={data}
      columns={columns}
      editingKey={editingKey}
      setEditingKey={setEditingKey}
      tableClass={style["item-table"]}
      tableRowClass={style["editable-row"]}
    />
  ) : (
    <HCenterSpin />
  );
}

export default AllTags;
