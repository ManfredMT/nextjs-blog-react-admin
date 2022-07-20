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
  Select,
  message as antMessage,
} from "antd";
import { useState, useMemo, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import style from "../css/PostComments.module.css";
import { useDispatch, useSelector } from "react-redux";
import HCenterSpin from "./HCenterSpin";
import usePrevious from "../hooks/usePrevious";
import {
  reset,
  getComments,
  deleteComment,
} from "../features/comments/commentSlice";
import { getPosts, reset as resetPost } from "../features/posts/postSlice";

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;

// let AllComments = [];
// for (let i = 0; i <= 1115; i++) {
//   AllComments.push({
//     id: `${i + 1}`,
//     source: `JavaScript 的关键功能，比如变量、字符串、数字、数组等(${i + 1})`,
//     commentContent: `comment ${i + 1}`,
//     author: `author ${i + 1}`,
//     time: new Date().toLocaleString(),
//   });
// }

// let AllPosts = [];
// for (let j = 0; j <= 1008; j++) {
//   AllPosts.push({
//     id: `post_${j + 1}`,
//     title: `JavaScript 的关键功能，比如变量、字符串、数字、数组等(${j + 1})`,
//   });
// }

//const plainOptions = AllComments.map((item) => item.id);

function PostComments() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const defaultPageSize = 10;

  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const dispatch = useDispatch();
  const { comments, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.comments
  );
  const {
    posts,
    isSuccess: isSuccessPost,
    isError: isErrorPost,
    message: messagePost,
  } = useSelector((state) => state.posts);
  useEffect(() => {
    dispatch(getComments());
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
    if (
      isSuccess &&
      (message === "评论已发布" ||
        message === "已取消发布评论" ||
        message === "成功删除评论")
    ) {
      antMessage.success(message);
      dispatch(getComments());
    }
  }, [isSuccess, message]);

  const allComments = useMemo(
    () =>
      comments.map((c) => {
        return {
          id: c._id,
          source: c.source,
          author: c.username,
          commentContent: c.comment,
          time: new Date(c.createdAt),
        };
      }),
    [comments]
  );

  useEffect(() => {
    dispatch(getPosts());
    return () => {
      dispatch(resetPost());
    };
  }, []);

  let isErrorResetPost = useRef(false);
  useEffect(() => {
    if (!isErrorPost) {
      isErrorResetPost.current = true;
    }
    if (isErrorResetPost.current && isErrorPost) {
      antMessage.error(messagePost);
    }
  }, [isErrorPost, messagePost]);

  const allPosts = useMemo(
    () =>
      posts.map((post) => {
        return {
          id: post._id,
          title: post.title,
        };
      }),
    [posts]
  );

  const [currentPageComments, setCurrentPageComments] = useState([]);
  const [paginationTotal, setPaginationTotal] = useState(0);
  let selectedComments = useRef();

  useEffect(() => {
    setCurrentPageComments(allComments.slice(0, defaultPageSize));
    setPaginationTotal(allComments.length);
    selectedComments.current = allComments;
  }, [allComments]);

  // console.log('selectedComments: ',selectedComments)
  // console.log("currentPageComments: ", currentPageComments);
  const currentPageCmId = useMemo(
    () => currentPageComments.map((item) => item.id),
    [currentPageComments]
  );
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
    setCurrentPageComments(selectedComments.current.slice(start, end));
    setCheckedList([]);
    setIndeterminate(false);
    setCheckAll(false);
  };

  const onChangeSelect = (value) => {
    console.log(`selected ${value}`);
    if (value === "allPosts") {
      selectedComments.current = allComments;
    } else {
      const filterResult = allComments.filter((c) => c.source === value);
      selectedComments.current = filterResult;
    }
    const end =
      selectedComments.current.length > defaultPageSize
        ? defaultPageSize
        : selectedComments.current.length;
    setCurrentPageComments(selectedComments.current.slice(0, end));
    setCheckedList([]);
    setIndeterminate(false);
    setCheckAll(false);
    setPaginationTotal(selectedComments.current.length);
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
      {allPosts.map((post) => {
        return (
          <Option key={post.id} value={post.title}>
            {post.title}
          </Option>
        );
      })}
    </Select>
  );

  const [modalText, setModalText] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const commentsId = useRef([]);
  const handleOk = () => {
    setIsModalVisible(false);
    commentsId.current.forEach((commentId) => {
      dispatch(deleteComment(commentId));
    });
  };

  const handleCancel = () => {
    commentsId.current = [];
    setIsModalVisible(false);
  };

  //console.log('checkedList: ',checkedList);

  const deleteSelectedCms = () => {
    setModalText(`确认删除所选评论(共${checkedList.length}条)?`);
    setIsModalVisible(true);
    commentsId.current = checkedList;
    // setCheckedList([]);
    // setIndeterminate(false);
    // setCheckAll(false);
  };

  const handleDeleteComment = ({ cId }) => {
    setModalText(`确认删除评论?`);
    setIsModalVisible(true);
    commentsId.current = [cId];
  };

  const preIsSuccess = usePrevious(isSuccess);
  const preIsSucPost = usePrevious(isSuccessPost);
  // console.log("isSuccess: ", isSuccess);
  // console.log("isSuccessPost: ", isSuccessPost);
  // console.log("preIsSuccess: ", preIsSuccess);
  // console.log("preIsSucPost: ", preIsSucPost);
  // console.log("allPost: ", allPosts);
  // console.log("allComments: ", allComments);

  return preIsSuccess && isSuccess && preIsSucPost && isSuccessPost ? (
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
                  <div className={style["comment-wrap"]}>
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
                        datetime={<p>{comment.time.toLocaleString()}</p>}
                      ></Comment>
                    </Checkbox>
                    {isTabletOrMobile ? (
                      <button
                        onClick={(e) => {
                          handleDeleteComment({ cId: comment.id }, e);
                        }}
                        className={style["delete-comment-button-mobile"]}
                      >
                        删除评论
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          handleDeleteComment({ cId: comment.id }, e);
                        }}
                        className={style["delete-comment-button"]}
                      >
                        删除评论
                      </button>
                    )}

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
  ) : (
    <HCenterSpin />
  );
}

export default PostComments;
