import {
  CalendarOutlined,
  CarryOutOutlined,
  GroupOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { message as antMessage } from "antd";
import "easymde/dist/easymde.min.css";
import "github-markdown-css";
import "katex/dist/katex.min.css";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark, dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkFootnotes from "remark-footnotes";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import style from "../css/PostPreview.module.css";
import { getSinglePost, reset } from "../features/posts/postSlice";
import HCenterSpin from "./HCenterSpin";
import { CopyToClipboard } from "react-copy-to-clipboard";
import rangeParser from "parse-numeric-range";
import CopyButton from "./CopyButton";
import copySvg from "./images/copy-svgrepo-com.svg";

function PostPreview() {
  const dispatch = useDispatch();
  const { singlePost, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.posts
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(getSinglePost(searchParams.get("preview")));
    return () => {
      dispatch(reset());
    };
  }, []);
  let isErrorReset = useRef(false);
  useEffect(() => {
    if (!isError) {
      isErrorReset.current = true;
    }
    if (isErrorReset.current && isError) {
      antMessage.error(message);
    }
  }, [isError, message]);

  const previewRender = useMemo(() => {
    return (
      <ReactMarkdown
        className={`${style["preview-post-body"]} markdown-body`}
        children={singlePost?.content ?? ""}
        remarkPlugins={[
          remarkGfm,
          [remarkFootnotes, { inlineNotes: true }],
          remarkMath,
        ]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const hasMeta = node?.data?.meta;
            const applyHighlights = (applyHighlights) => {
              if (hasMeta) {
                const RE = /{([\d,-]+)}/;
                const metadata = node.data.meta?.replace(/\s/g, "");
                const strlineNumbers = RE?.test(metadata)
                  ? RE?.exec(metadata)[1]
                  : "0";
                const highlightLines = rangeParser(strlineNumbers);
                const highlight = highlightLines;
                const data = highlight.includes(applyHighlights)
                  ? "highlight"
                  : null;
                return { data };
              } else {
                return {};
              }
            };
            if (!inline && match) {
              return (
                <div className={style["code-box"]}>
                  <div className={style["code-header"]}>
                 <CopyButton 
                 classCopied={style["copied"]}
                 classCopy={style["copy-button"]}
                 text={String(children)}  />
                </div>
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    style={atomDark}
                    className={style["syntax-highlighter"]}
                    wrapLines={true}
                    showLineNumbers={true}
                    useInlineStyles={true}
                    lineProps={applyHighlights}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                </div>
              );
            } else if (!inline) {
              return (
                <div className={style["code-box"]}>
                  <div className={style["code-header"]}>
                 <CopyButton 
                 classCopied={style["copied"]}
                 classCopy={style["copy-button"]}
                 text={String(children)}  />
                </div>
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    style={atomDark}
                    className={style["syntax-highlighter"]}
                    wrapLines={true}
                    showLineNumbers={true}
                    useInlineStyles={true}
                    lineProps={applyHighlights}
                    language={'text'}
                    PreTag="div"
                    {...props}
                  />
                </div>
              );
            } else {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          },
        }}
      />
    );
  }, [singlePost, copied]);

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
