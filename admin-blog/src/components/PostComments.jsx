import { DeleteFilled } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Checkbox,
  Comment,
  Divider,
  Empty,
  Modal,
  Pagination,
  Select
} from "antd";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import style from "../css/PostComments.module.css";

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;

let AllComments = [];
for (let i = 0; i <= 1115; i++) {
  AllComments.push({
    id: `${i + 1}`,
    source: `JavaScript 的关键功能，比如变量、字符串、数字、数组等(${i + 1})`,
    commentContent: `comment ${i + 1}`,
    author: `author ${i + 1}`,
    time: new Date().toLocaleString(),
  });
}

let AllPosts = [];
for (let j = 0; j <= 1008; j++) {
  AllPosts.push({
    id: `post_${j + 1}`,
    title: `JavaScript 的关键功能，比如变量、字符串、数字、数组等(${j + 1})`,
  });
}

//const plainOptions = AllComments.map((item) => item.id);

function PostComments() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const defaultPageSize = 10;

  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [currentPageComments, setCurrentPageComments] = useState(
    AllComments.slice(0, defaultPageSize)
  );
  const [paginationTotal, setPaginationTotal] = useState(AllComments.length);
  let selectedComments = AllComments;

  // console.log('selectedComments: ',selectedComments)
  // console.log("currentPageComments: ", currentPageComments);
  const currentPageCmId = currentPageComments.map((item) => item.id);
  const onChange = (list) => {
    setCheckedList(list);
    //setIndeterminate(list.length && list.length < pageSize);
    setIndeterminate(list.length && list.length < currentPageComments.length);
    setCheckAll(list.length === currentPageComments.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? currentPageCmId : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const onChangePage = (page, pageSize) => {
    const start = (page - 1) * defaultPageSize;
    const end = start + pageSize;
    setCurrentPageComments(selectedComments.slice(start, end));
    setCheckedList([]);
    setIndeterminate(false);
    setCheckAll(false);
  };

  const onChangeSelect = (value) => {
    console.log(`selected ${value}`);
    if (value === "allPosts") {
      selectedComments = AllComments;
    } else {
      const filterResult = AllComments.filter((c) => c.source === value);
      selectedComments = filterResult;
    }
    const end =
      selectedComments.length > defaultPageSize
        ? defaultPageSize
        : selectedComments.length;
    setCurrentPageComments(selectedComments.slice(0, end));
    setCheckedList([]);
    setIndeterminate(false);
    setCheckAll(false);
    setPaginationTotal(selectedComments.length);
  };

  const renderPostSelect = (
    <Select
      showSearch
      placeholder="选择文章"
      optionFilterProp="children"
      onChange={onChangeSelect}
      filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
      className={style["post-select"]}
      defaultValue="allPosts"

      //onChange={handleChange}
    >
      <Option value="allPosts">所有文章</Option>
      {AllPosts.map((post) => {
        return (
          <Option key={post.id} value={post.title}>
            {post.title}
          </Option>
        );
      })}
    </Select>
  );

  const [isHover, setIsHover] = useState([]);
  const [modalText, setModalText] = useState("");

  const handleMouseEnter = (i) => {
    //console.log(`handle mouse enter i: ${i}`);

    const isHoverCopy = [];
    isHoverCopy[i] = true;
    setIsHover(isHoverCopy);
  };

  const handleMouseLeave = (i) => {
    //console.log(`handle mouse leave i: ${i}`);

    const isHoverCopy = [];
    isHoverCopy[i] = false;
    setIsHover(isHoverCopy);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const deleteSelectedCms = () => {
    setModalText(`确认删除所选评论(共${checkedList.length}条)?`);
    setIsModalVisible(true);
    // setCheckedList([]);
    // setIndeterminate(false);
    // setCheckAll(false);
  };

  const deleteComment = () => {
    setModalText(`确认删除评论?`);
    setIsModalVisible(true);
  };

  return (
    <>
      <div className={style["post-comments-box"]}>
        <div className={style["comments-header"]}>
          {isTabletOrMobile ? renderPostSelect : null}
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
            className={style["checkbox"]}
          >
            全选
          </Checkbox>
          {isTabletOrMobile ? (
            <button
              className={style["delete-selected-icon-button"]}
              disabled={checkedList.length === 0}
              onClick={deleteSelectedCms}
            >
              <DeleteFilled />
            </button>
          ) : (
            <Button
              danger
              type="primary"
              disabled={checkedList.length === 0}
              onClick={deleteSelectedCms}
            >
              删除所选评论
            </Button>
          )}

          <span className={style["tip-text"]}>
            {checkedList.length > 0
              ? ` 已选中${checkedList.length}条评论`
              : null}
          </span>
          {isTabletOrMobile ? null : renderPostSelect}
        </div>
        <Divider />
        <CheckboxGroup
          className={style["checkbox-group"]}
          value={checkedList}
          onChange={onChange}
        >
          {currentPageComments.length > 0 ? (
            currentPageComments.map((comment, i) => {
              return (
                <div key={comment.id}>
                  <div
                    onMouseEnter={(e) => handleMouseEnter(i, e)}
                    onMouseLeave={(e) => handleMouseLeave(i, e)}
                    className={style["comment-wrap"]}
                  >
                    <Checkbox className={style["checkbox"]} value={comment.id}>
                      <Comment
                        className={style["comment-box"]}
                        author={comment.author}
                        avatar={
                          <Avatar
                          style={{
                        color: "#457fca",
                        backgroundColor: "#d7e9ff",
                      }}
                            alt={comment.author}
                          >
                            {comment.author.charAt(0).toUpperCase()}
                          </Avatar>
                        }
                        content={<p>{comment.commentContent}</p>}
                        datetime={<p>{comment.time}</p>}
                      ></Comment>
                    </Checkbox>
                    {isTabletOrMobile ? (
                      <button
                        onClick={deleteComment}
                        className={style["delete-comment-button-mobile"]}
                      >
                        删除评论
                      </button>
                    ) : isHover[i] === true ? (
                      <button
                        onClick={deleteComment}
                        className={style["delete-comment-button"]}
                      >
                        删除评论
                      </button>
                    ) : null}

                    <span className={style["source-right"]}>
                      所在文章: {comment.source}
                    </span>
                  </div>
                  <Divider className={style["divider"]} />
                </div>
              );
            })
          ) : (
            <Empty />
          )}
        </CheckboxGroup>
        {paginationTotal > defaultPageSize ? (
          <Pagination
            className={style["pagination"]}
            total={paginationTotal}
            onChange={onChangePage}
            showSizeChanger={false}
            pageSize={defaultPageSize}
          ></Pagination>
        ) : null}
      </div>
      <Modal
        title="删除评论"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
}

export default PostComments;
