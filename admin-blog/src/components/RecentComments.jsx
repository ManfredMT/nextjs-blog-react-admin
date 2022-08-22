import { DeleteOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  Comment,
  Divider, message as antMessage, Modal,
  Tooltip,
  Empty
} from "antd";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "../css/RecentComments.module.css";
import {
  deleteComment, getComments, reset
} from "../features/comments/commentSlice";
import HCenterSpin from "./HCenterSpin";

function RecentComments() {
  const dispatch = useDispatch();
  const { comments, isSuccess, isError, message } = useSelector(
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
  }, [isSuccess, message, dispatch]);

  const allComments = useMemo(
    () =>
      comments.map((c) => {
        return {
          id: c._id,
          source: c.source,
          time: new Date(c.createdAt),
          commentContent: c.comment,
          author: c.username,
          email:c.email,
        };
      }).sort((a,b)=>b.time-a.time),
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

  return isSuccess ? (
    <>{allComments.length===0?<Empty />:
      <div className={style["recent-comment-box"]}>
        {allComments.map(
          ({ id, source, time, commentContent, author,email }) => {
            return (
              <Card
                key={id}
                className={style["card-box"]}
              >
                <Comment
                  className={style["comment-box"]}
                  author={author}
                  avatar={
                    <Tooltip title={email}>
                    <Avatar
                      style={{
                        color: "#457fca",
                        backgroundColor: "#d7e9ff",
                      }}
                      alt={author}
                     
                    >
                      {author.charAt(0).toUpperCase()}
                    </Avatar></Tooltip>
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
      </div>}
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
