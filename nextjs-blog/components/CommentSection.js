import CommentForm from "./CommentForm";
import Comments from "./Comments";
import { useState } from "react";

export default function CommentSection({postId}) {
  const [isCommentChange, setIsCommentChange] = useState(false);
  return (
    <>
      <CommentForm postId={postId} setIsCommentChange={setIsCommentChange} />
      <Comments
        postId={postId}
        isCommentChange={isCommentChange}
        setIsCommentChange={setIsCommentChange}
      />
    </>
  );
}
