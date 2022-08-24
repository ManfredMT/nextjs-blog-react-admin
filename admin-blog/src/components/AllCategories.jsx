import { DeleteFilled, EditFilled, GroupOutlined } from "@ant-design/icons";
import { Form, message as antMessage, Popconfirm, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import style from "../css/AllItems.module.css";
import { getPosts, reset, updateCategory } from "../features/posts/postSlice";
import useColumnSearch from "../hooks/useColumnSearch";
import useGetData from "../hooks/useGetData";
import EditableTable from "./EditableTable";
import HCenterSpin from "./HCenterSpin";

function getCategoryCount(posts) {
  let categoryCount = [
    {
      key: "default",
      categoryName: "default",
      postNumber: 0,
    },
  ];
  posts.forEach(({ category }) => {
    const index = categoryCount.findIndex((c) => c.categoryName === category);
    if (index === -1) {
      categoryCount.push({
        key: category,
        categoryName: category,
        postNumber: 1,
      });
    } else {
      categoryCount[index].postNumber += 1;
    }
  });
  return categoryCount;
}

function AllCategories() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const { posts, isSuccess, isError, message } = useSelector(
    (state) => state.posts
  );

  //console.log("AllCategories");
  useGetData(getPosts, reset, isError, message);

  useEffect(() => {
    if (isSuccess && message === "类别已更改") {
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

  const originData = getCategoryCount(allPosts);
  const data = useMemo(() => originData, [originData]);

  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      categoryName: "",
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
      let categoryFormData = new FormData();
      categoryFormData.append("oldCategory", key);
      categoryFormData.append("newCategory", row.categoryName);
      dispatch(updateCategory(categoryFormData));
      setEditingKey("");
    } catch (errInfo) {
      console.error("数据错误:", errInfo);
    }
  };

  const handleDelete = (key) => {
    let categoryFormData = new FormData();
    categoryFormData.append("oldCategory", key);
    categoryFormData.append("newCategory", "default");
    dispatch(updateCategory(categoryFormData));
  };

  //实现一个搜索列
  const inputPlaceholder = "搜索分类名";
  const renderColumn = (text, dataIndex, searchedColumn, searchText) =>
    searchedColumn === dataIndex ? (
      <>
        <Link to={`../post-category?category=${text}`}>
          <GroupOutlined />
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
        <Link to={`../post-category?category=${text}`}>
          <GroupOutlined />
          {` ${text}`}
        </Link>
      </>
    );
  const getColumnSearchProps = useColumnSearch(inputPlaceholder, renderColumn);

  const columns = [
    {
      title: "分类名",
      dataIndex: "categoryName",
      width: isTabletOrMobile ? "45%" : "65%",
      editable: true,
      sortDirections: ["descend"],
      sorter: (a, b) =>
        a.categoryName.toUpperCase() < b.categoryName.toUpperCase(),
      ...getColumnSearchProps("categoryName"),
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
            {record.categoryName !== "default" ? (
              <Typography.Link
                className={style["edit-button"]}
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
              >
                编辑
              </Typography.Link>
            ) : null}
            {data.length >= 1 && record.categoryName !== "default" ? (
              <Popconfirm
                className={style["delete-button-mobile"]}
                okText="确认"
                cancelText="取消"
                title="确认删除分类?"
                onConfirm={() => handleDelete(record.key)}
              >
                <button className={style["no-style-button"]}>删除</button>
              </Popconfirm>
            ) : null}
          </>
        ) : (
          <>
            {record.categoryName !== "default" ? (
              <Typography.Link
                className={style["edit-button-desktop"]}
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
              >
                <div className={style["edit-button-desktop-box"]}>
                  <EditFilled /> 编辑
                </div>
              </Typography.Link>
            ) : null}
            {data.length >= 1 && record.categoryName !== "default" ? (
              <Popconfirm
                className={style["delete-button-desktop"]}
                okText="确认"
                cancelText="取消"
                title="未分类的文章会被归为default(未分类),确认删除分类?"
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

  return isSuccess ? (
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

export default AllCategories;
