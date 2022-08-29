import { useEffect, useState } from "react";
import styles from "../styles/CommentForm.module.css";

export default function CommentForm({ postId, setIsCommentChange }) {
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showNotice, setShowNotice] = useState(false);
  const form = {
    postId,
    username,
    email,
    comment,
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const postData = async () => {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams(form),
      });
      if (response.status >= 400 && response.status < 600) {
        throw new Error("Bad response from server");
      }
      const json = await response.json();
      return json;
    };
    postData()
      .then((data) => {
        //console.log("response data: ", data);
        setMessage("评论已发送");
        setShowNotice(true);
        setIsCommentChange(true);
      })
      .catch((error) => {
        console.error("error: ", error.message);
        setMessage("发送失败");
        setShowNotice(true);
      })
      .finally(() => {
        setComment("");
        setUsername("");
        setEmail("");
      });

  };
  useEffect(() => {
    if (showNotice) {
      setTimeout(() => {
        setShowNotice(false);
      }, 3000);
    }
  }, [showNotice]);

  return (
    <div className={styles["comment-form-box"]}>
      <form onSubmit={onSubmit}>
        <textarea
          className={styles["comment-textarea"]}
          required
          name="comment"
          maxLength={1000}
          placeholder="评论"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <input type="hidden" name="postId" value={postId} />
        <div className={styles["user-info-wrap"]}>
          <input
            className={styles["username-input"]}
            required
            type="text"
            name="username"
            maxLength={100}
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className={styles["email-input"]}
            required
            type="email"
            name="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <input
          className={styles["submit-button"]}
          type="submit"
          value="发送评论"
        />
      </form>
      {showNotice ? (
        <div className={styles["notification"]}>{message}</div>
      ) : null}
    </div>
  );
}
