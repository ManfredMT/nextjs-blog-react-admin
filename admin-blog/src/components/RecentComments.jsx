import { DeleteOutlined } from "@ant-design/icons";
import { Avatar, Card, Comment, Divider, Modal, Tooltip } from "antd";
import moment from "moment";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import style from "../css/RecentComments.module.css";

const comments = [
  { source: "post 1", time: "", commentContent: "comment 1", author: "Tom" },
  { source: "post 13", time: "", commentContent: "comment 2", author: "Tom" },
  { source: "post 1", time: "", commentContent: "comment 3", author: "Tom" },
  {
    source: "post 1",
    time: "",
    commentContent:
      "An image cropper for Ant Design Upload. To prevent overwriting the custom styles to antd, antd-img-crop does not import the style files of components. Therefore, if your project configured babel-plugin-import, and not use Modal or Slider, you need to import the styles yourself:",
    author: "Mark",
  },
  { source: "post 12", time: "", commentContent: "comment 5", author: "Mark" },
  { source: "post 1", time: "", commentContent: "comment 6", author: "Mark" },
  { source: "post 11", time: "", commentContent: "comment 7", author: "Mark" },
];

function RecentComments() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [isHover, setIsHover] = useState([]);

  const handleMouseEnter = (i) => {
    const isHoverCopy = [];
    isHoverCopy[i] = true;
    setIsHover(isHoverCopy);
  };

  const handleMouseLeave = (i) => {
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

  const deleteComment = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <div className={style["recent-comment-box"]}>
        {comments.map(({ source, time, commentContent, author }, index) => {
          return (
            <Card
              key={index}
              onMouseEnter={(e) => handleMouseEnter(index, e)}
              onMouseLeave={(e) => handleMouseLeave(index, e)}
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
                  <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                    <span>{moment().fromNow()}</span>
                  </Tooltip>
                }
              ></Comment>
              <Divider className={style["divider"]} />
              <div className={style["source-delete-box"]}>
                <span>{`来源: ${source}`}</span>
                {isTabletOrMobile ? (
                  <button
                    onClick={deleteComment}
                    className={style["delete-button"]}
                  >
                    <DeleteOutlined />
                  </button>
                ) : isHover[index] === true ? (
                  <button
                    onClick={deleteComment}
                    className={style["delete-button"]}
                  >
                    <DeleteOutlined />
                  </button>
                ) : null}
              </div>
            </Card>
          );
        })}
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
  );
}

export default RecentComments;
