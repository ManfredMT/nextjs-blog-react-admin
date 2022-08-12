import { useEffect, useRef, useState } from "react";
import styles from "../styles/Comments.module.css";

export default function Comment({ postId }) {
  const [comments, setComments] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:5000/api/comments/" + postId,
        {
          method: "GET",
        }
      );
      const json = await response.json();
      setComments(json);
    };

    fetchData().catch(console.error);
  }, []);
  console.log("comments: ", comments);
  return comments !== null ? (
    <div className={styles["comments-box"]}>
      <h3 className={styles["comment-label"]}>{`评论 : `}</h3>
      {comments.map((c) => {
        const commentCreatedDate = new Date(c.createdAt);
        const formatCreated = `${commentCreatedDate.getFullYear()}年${
          commentCreatedDate.getMonth() + 1
        }月${commentCreatedDate.getDate()}日`;
        return (
          <div className={styles["comment-wrap"]} key={c._id}>
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
