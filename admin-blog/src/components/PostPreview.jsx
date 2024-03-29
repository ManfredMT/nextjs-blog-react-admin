import {
  CalendarOutlined,
  CarryOutOutlined,
  GroupOutlined,
  UserOutlined
} from "@ant-design/icons";
import { message as antMessage } from "antd";
import "easymde/dist/easymde.min.css";
import "github-markdown-css";
import "katex/dist/katex.min.css";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import style from "../css/PostPreview.module.css";
import { getSinglePost, reset, resetError } from "../features/posts/postSlice";
import HCenterSpin from "./HCenterSpin";
import MDComponent from "./MDComponent";

function PostPreview() {
  const dispatch = useDispatch();
  const { singlePost, isError, message } = useSelector(
    (state) => state.posts
  );

  const [searchParams] = useSearchParams();


  useEffect(() => {
    dispatch(getSinglePost(searchParams.get("preview")));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (isError) {
      antMessage.error(message);
    }
    return ()=>{
      dispatch(resetError());
    }
  }, [isError, message, dispatch]);

  const previewRender = useMemo(() => {
    return (
      <MDComponent
        reactMDClass={`${style["preview-post-body"]} markdown-body`}
        mdChildren={singlePost?.content ?? ""}
        codeBoxClass={style["code-box"]}
        syntaxHLClass={style["syntax-highlighter"]}
        hasCopyButton={true}
        codeHeaderClass={style["code-header"]}
        classCopied={style["copied"]}
        classCopy={style["copy-button"]}
      />
    );
  }, [singlePost]);

  return singlePost ? (
    <div className={style["preview-body"]}>
      <div className={style["link-top-box"]}>
        <Link className={style["link-top"]} to="/manage/post/all-posts">
          {`⬅ 返回文章列表`}
        </Link>
      </div>

      <h2
        className={style[singlePost.draft ? "post-title-draft" : "post-title"]}
      >
        {singlePost.title}
      </h2>
      <div className={style["post-info-first-row"]}>
        <p>
          <span className={style["grey-label"]}>
            <UserOutlined />
            {` 作者: `}
          </span>
          {singlePost.authors.map((author, i) => (
            <span key={i}>{`${author} `}</span>
          ))}
        </p>
        <span className={style["v-divider"]}>|</span>
        <p>
          <span className={style["grey-label"]}>
            <CalendarOutlined />
            {` 发布时间: `}
          </span>
          {new Date(singlePost.createdAt).toLocaleString()}
        </p>
        <span className={style["v-divider"]}>|</span>
        <p>
          <span className={style["grey-label"]}>
            <CarryOutOutlined />
            {` 更新时间: `}
          </span>
          {new Date(singlePost.updatedAt).toLocaleString()}
        </p>
      </div>
      <div className={style["post-category-box"]}>
        <span className={style["post-category-label"]}>
          <GroupOutlined />
          {` 分类: `}
        </span>
        <span className={style["post-category"]}>
          {singlePost.category === "default" ? "未分类" : singlePost.category}
        </span>
      </div>
      <div className={style["post-tag-box"]}>
        {singlePost.tags.length !== 0
          ? singlePost.tags.map((tag, i) => {
              if (tag) {
                return (
                  <span className={style["tag-box"]} key={i}>
                    {tag}
                  </span>
                );
              } else {
                return null;
              }
            })
          : null}
      </div>
      {previewRender}
    </div>
  ) : (
    <HCenterSpin />
  );
}

export default PostPreview;
