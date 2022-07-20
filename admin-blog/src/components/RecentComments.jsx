import { DeleteOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  Comment,
  Divider,
  Modal,
  Tooltip,
  message as antMessage,
} from "antd";
import moment from "moment";
import { useState, useMemo, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import style from "../css/RecentComments.module.css";
import { useDispatch, useSelector } from "react-redux";
import HCenterSpin from "./HCenterSpin";
import usePrevious from "../hooks/usePrevious";
import {
  reset,
  getComments,
  deleteComment,
} from "../features/comments/commentSlice";

// const comments = [
//   { source: "post 1", time: "", commentContent: "comment 1", author: "Tom" },
//   { source: "post 13", time: "", commentContent: "comment 2", author: "Tom" },
//   { source: "post 1", time: "", commentContent: "comment 3", author: "Tom" },
//   {
//     source: "post 1",
//     time: "",
//     commentContent:
//       "An image cropper for Ant Design Upload. To prevent overwriting the custom styles to antd, antd-img-crop does not import the style files of components. Therefore, if your project configured babel-plugin-import, and not use Modal or Slider, you need to import the styles yourself:",
//     author: "Mark",
//   },
//   { source: "post 12", time: "", commentContent: "comment 5", author: "Mark" },
//   { source: "post 1", time: "", commentContent: "comment 6", author: "Mark" },
//   { source: "post 11", time: "", commentContent: "comment 7", author: "Mark" },
// ];

function RecentComments() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const dispatch = useDispatch();
  const { comments, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.comments
  );
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
          time: new Date(c.createdAt),
          commentContent: c.comment,
          author: c.username,
        };
      }),
    [comments]
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const commentId = useRef();

  const handleOk = () => {
    if (commentId.current) {
      dispatch(deleteComment(commentId.current));
    } else {
      antMessage.error("评论ID未知");
    }
    commentId.current = null;
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeleteComment = ({ cId }) => {
    commentId.current = cId;
    setIsModalVisible(true);
  };

  const preIsSuccess = usePrevious(isSuccess);

  return preIsSuccess && isSuccess ? (
    <>
      <div className={style["recent-comment-box"]}>
        {allComments.map(
          ({ id, source, time, commentContent, author }, index) => {
            return (
              <Card
                key={id}
                className={style["card-box"]}
              >
                <Comment
                  className={style["comment-box"]}
                  author={author}
                  avatar={
                    <Avatar
                      style={{
                        color: "#457fca",
                        backgroundColor: "#d7e9ff",
                      }}
                      alt={author}
                    >
                      {author.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  content={
                    <p className={style["comment-content"]}>{commentContent}</p>
                  }
                  datetime={
                    <Tooltip title={moment(time).format("YYYY-MM-DD HH:mm:ss")}>
                      <span>{moment(time).fromNow()}</span>
                    </Tooltip>
                  }
                ></Comment>
                <Divider className={style["divider"]} />
                <div className={style["source-delete-box"]}>
                  <span>{`来源: ${source}`}</span>
                  <button
                    onClick={(e) => {
                      handleDeleteComment({ cId: id }, e);
                    }}
                    className={style["delete-button"]}
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </Card>
            );
          }
        )}
      </div>
      <Modal
        title="删除评论"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <p>确定删除评论?</p>
      </Modal>
    </>
  ):<HCenterSpin/>;
}

export default RecentComments;
