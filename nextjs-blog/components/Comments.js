import { useEffect, useState, useCallback } from "react";
import styles from "../styles/Comments.module.css";
import styleAni from "../styles/AnimatePublic.module.css";

export default function Comments({
  postId,
  isCommentChange,
  setIsCommentChange,
}) {
  const [comments, setComments] = useState(null);

  const fetchData = useCallback(async (signal) => {
    const response = await fetch("/api/comments/" + postId, {
      method: "GET",
      signal,
    });
    const json = await response.json();
    setComments(json);
  }, [postId]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchData(signal).catch((err)=>{
      if(err.name !== "AbortError") {
        console.error(err);
      }else {
        //console.log("取消请求");
      };
    });
    return () => {
      controller.abort();
      setIsCommentChange(false);
    };
  }, [postId, isCommentChange, setIsCommentChange, fetchData]);

  return comments !== null ? (
    <div className={styles["comments-box"]}>
      <h3 className={styles["comment-label"]}>{`评论 : `}</h3>
      {comments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((c) => {
          const commentCreatedDate = new Date(c.createdAt);
          const formatCreated = `${commentCreatedDate.getFullYear()}年${
            commentCreatedDate.getMonth() + 1
          }月${commentCreatedDate.getDate()}日`;
          return (
            <div
              className={`${styles["comment-wrap"]} ${styleAni["fade-in-top"]}`}
              key={c._id}
            >
              <div className={styles["comment-user"]}>{c.username}</div>
              <time className={styles["comment-date"]}>{formatCreated}</time>
              <div className={styles["comment"]}>{c.comment}</div>
            </div>
          );
        })}
    </div>
  ) : (
    <p>loading</p>
  );
}
