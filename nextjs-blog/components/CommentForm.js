import { useEffect, useRef, useState } from "react";

export default function CommentForm({ postId }) {
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const form = {
    postId,
    username,
    email,
    comment,
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const postData = async () => {
      const response = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        body: new URLSearchParams(form),
      });
      const json = await response.json();
    };
    postData().catch(console.error);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <textarea
          required
          name="comment"
          maxLength={1000}
          placeholder="评论"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <input type="hidden" name="postId" value={postId} />
        <input
          required
          type="text"
          name="username"
          maxLength={100}
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          required
          type="email"
          name="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input type="submit" value="发送评论" />
      </form>
    </div>
  );
}
