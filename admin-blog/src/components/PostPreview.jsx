import "easymde/dist/easymde.min.css";
import "github-markdown-css";
import {
  AutoComplete,
  Button,
  Form,
  Input,
  message as antMessage,
  Radio,
  Select,
  Spin,
  Upload,
} from "antd";
import { useMemo,useEffect,useRef } from "react";
import ReactDOMServer from "react-dom/server";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkFootnotes from "remark-footnotes";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import 'katex/dist/katex.min.css';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getSinglePost, reset,} from "../features/posts/postSlice";
import HCenterSpin from "./HCenterSpin"
import style from "../css/PostPreview.module.css"

function PostPreview() {
  const dispatch = useDispatch();
  const { singlePost, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.posts
  );
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(getSinglePost(searchParams.get('preview')));
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

  const previewRender = useMemo(()=>{
    return (
      <ReactMarkdown
        className={`${style["preview-post-body"]} markdown-body`}
        children={singlePost?.content??''}
        remarkPlugins={[
          remarkGfm,
          [remarkFootnotes, { inlineNotes: true }],
          remarkMath,
        ]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                style={atomDark}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    );

  },[singlePost])


  return singlePost?(
    <div className={style["preview-body"]}>
    <div className={style["link-top-box"]}>
        <Link className={style["link-top"]} to="/manage/post/all-posts">
          {`⬅ 返回文章列表`}
        </Link>
      </div>

    <h2 className={style["post-title"]}>{singlePost.title}</h2>
    
    {previewRender}
    </div>
  ):<HCenterSpin/>
}

export default PostPreview