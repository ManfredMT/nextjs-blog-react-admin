import { useEffect, useRef, useState } from "react";

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
  return comments!==null?(<div>{comments.map((c)=>{
    return <div key={c._id}>
    <div>{c.username}</div>
    <div>{c.createdAt}</div>
    <div>{c.comment}</div>
    </div>
  })}</div>):<p>loading</p>;
}
