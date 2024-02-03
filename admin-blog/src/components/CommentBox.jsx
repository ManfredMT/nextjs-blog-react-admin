import React from "react";

function CommentBox({ className, author, avatar, content, datetime }) {
  return (
    <div className={className}>
      <div style={{ display: "flex",margin: "4px" }}>
        <div
          style={{
            flexShrink: "0",
            position: "relative",
            cursor: "pointer",
            marginRight: "12px",
          }}
        >
          {avatar}
        </div>
        <div
          style={{ flex: "1 1 auto", position: "relative", minWidth: "0px" }}
        >
          <div
            style={{
              display: "flex",
            //   flexWrap: "wrap",
              justifyContent: "flex-start",
              
            }}
          >
            <span style={{paddingRight: "8px", color: "#00000073"}}>{author}</span>
            <span style={{color: "#ccc"}}>{datetime}</span>
          </div>
          <div>{content}</div>
        </div>
      </div>
    </div>
  );
}

export default CommentBox;
