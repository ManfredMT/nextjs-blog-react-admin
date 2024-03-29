import { DeleteOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  //Comment,
  Divider, Empty, message as antMessage, Modal,
  Tooltip
} from "antd";
import CommentBox from "./CommentBox";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "../css/RecentComments.module.css";
import {
  deleteComment, getComments, reset, resetError
} from "../features/comments/commentSlice";
import useGetData from "../hooks/useGetData";
import HCenterSpin from "./HCenterSpin";

dayjs.extend(relativeTime);

function RecentComments() {
  const dispatch = useDispatch();
  const { comments, isSuccess, isError,isLoadEnd, message } = useSelector(
    (state) => state.comments
  );
  useGetData(getComments, reset, isError, message, resetError);

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

  return isLoadEnd ? (
    <>{allComments.length===0?<Empty />:
      <div className={style["recent-comment-box"]}>
        {allComments.map(
          ({ id, source, time, commentContent, author,email }) => {
            return (
              <Card
                key={id}
                className={style["card-box"]}
              >
                <CommentBox
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
                    <Tooltip title={dayjs(time).format("YYYY-MM-DD HH:mm:ss")}>
                      <span>{dayjs(time).fromNow()}</span>
                    </Tooltip>
                  }
                ></CommentBox>
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
        open={isModalVisible}
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
