import { DeleteFilled } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Checkbox,
  //Comment,
  Divider,
  Empty, message as antMessage, Modal,
  Pagination,
  Select
} from "antd";
import CommentBox from "./CommentBox";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import style from "../css/PostComments.module.css";
import {
  deleteComment, getComments, reset, resetIsError
} from "../features/comments/commentSlice";
import { getPosts, reset as resetPost, resetIsError as resetIsErrorPost } from "../features/posts/postSlice";
import useGetData from "../hooks/useGetData";
import usePrevious from "../hooks/usePrevious";
import HCenterSpin from "./HCenterSpin";

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;

function PostComments() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const defaultPageSize = 10;

  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [selectedValue, setSelectedValue] = useState("allPosts");
  const dispatch = useDispatch();
  const { comments, isSuccess, isError,isLoadEnd, message } = useSelector(
    (state) => state.comments
  );
  const {
    posts,
    isError: isErrorPost,
    isLoadEnd: isLoadEndPost,
    message: messagePost,
  } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getComments());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const preMessage = usePrevious(message);
  useEffect(() => {
    if (isError && preMessage !== message) {
      antMessage.error(message);
    }
    return ()=>{
      dispatch(resetIsError());
    }
  }, [isError, message, dispatch, preMessage]);

  useEffect(() => {
    if (
      isSuccess &&
      (message === "评论已发布" ||
        message === "已取消发布评论" ||
        message === "成功删除评论")
    ) {
      antMessage.success(message);
      dispatch(getComments());
      setCheckedList([]);
      setIndeterminate(false);
      setSelectedValue("allPosts");
    }
  }, [isSuccess, message, dispatch]);

  const allComments = useMemo(
    () =>
      comments
        .map((c) => {
          return {
            id: c._id,
            source: c.source,
            author: c.username,
            commentContent: c.comment,
            time: new Date(c.createdAt),
          };
        })
        .sort((a, b) => b.time - a.time),
    [comments]
  );
  useGetData(getPosts, resetPost, isErrorPost, messagePost, resetIsErrorPost);

  const allPosts = useMemo(
    () =>
      posts
        .filter((p) => !p.draft)
        .map((post) => {
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

  const currentPageCmId = useMemo(
    () => currentPageComments.map((item) => item.id),
    [currentPageComments]
  );
  const onChange = (list) => {
    setCheckedList(list);
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
    setSelectedValue(value);
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
      value={selectedValue}
      filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
      className={style["post-select"]}
      defaultValue="allPosts"
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

  const deleteSelectedCms = () => {
    setModalText(`确认删除所选评论(共${checkedList.length}条)?`);
    setIsModalVisible(true);
    commentsId.current = checkedList;
  };

  const handleDeleteComment = ({ cId }) => {
    setModalText(`确认删除评论?`);
    setIsModalVisible(true);
    commentsId.current = [cId];
  };

  //isLoadEnd为true时,currentPageComments数据未得到,需等待下一次渲染.
  const preIsLoadEnd = usePrevious(isLoadEnd);

  return preIsLoadEnd && isLoadEnd && isLoadEndPost ? (
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
                      <CommentBox
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
                        datetime={<span>{comment.time.toLocaleString()}</span>}
                      ></CommentBox>
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
        open={isModalVisible}
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
