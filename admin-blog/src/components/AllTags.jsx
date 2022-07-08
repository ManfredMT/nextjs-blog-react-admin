import {
  DeleteFilled,
  EditFilled,
  SearchOutlined,
  TagOutlined
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber, message as antMessage, Popconfirm,
  Space,
  Table,
  Typography
} from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import style from "../css/AllItems.module.css";
import {
  deleteTag, getPosts,
  reset,
  updateTag
} from "../features/posts/postSlice";
import usePrevious from "../hooks/usePrevious";
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

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `请输入${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function AllTags() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const { posts, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.posts
  );

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
    if (isSuccess && (message === "标签已更改" || message === "标签已删除")) {
      antMessage.success(message);
      dispatch(getPosts());
    }
  }, [isSuccess, message]);

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

  useEffect(() => {
    setData(originData);
  }, [allPosts]);

  const [data, setData] = useState(originData);
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
      console.log("key: ", key);
      console.log("row: ", row);
      let tagFormData = new FormData();
      tagFormData.append("oldTag", key);
      tagFormData.append("newTag", row.tagName);
      dispatch(updateTag(tagFormData));
      setEditingKey("");
    } catch (errInfo) {
      console.log("数据错误:", errInfo);
    }
  };

  const handleDelete = (key) => {
    let tagFormData = new FormData();
    tagFormData.append("tag", key);
    dispatch(deleteTag(tagFormData));
  };

  //实现一个搜索列
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  let searchInput;

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={"搜索标签名"}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            筛选
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
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
      ),
  });

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
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "postNumber" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const preIsSuccess = usePrevious(isSuccess);

  return preIsSuccess && isSuccess ? (
    <Form form={form} component={false}>
      <Table
        className={style["item-table"]}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        //bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName={style["editable-row"]}
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  ) : (
    <HCenterSpin />
  );
}

export default AllTags;
