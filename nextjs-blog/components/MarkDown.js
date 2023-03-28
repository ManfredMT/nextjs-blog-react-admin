import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeKatex from "rehype-katex";
import rehypeSlug from 'rehype-slug'
import remarkFootnotes from "remark-footnotes";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rangeParser from "parse-numeric-range";
import CopyButton from "./CopyButton";
import "github-markdown-css";
import "katex/dist/katex.min.css";
import styles from "../styles/MarkDown.module.css";

function MarkDown({
  mdChildren,
}) {
  return (
    <ReactMarkdown
      className={`${styles["preview-post-body"]} markdown-body`}
      //children={mdChildren}
      remarkPlugins={[
        remarkGfm,
        [remarkFootnotes, { inlineNotes: true }],
        remarkMath,
      ]}
      rehypePlugins={[rehypeKatex, rehypeSlug]}
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
              <div className={styles["code-box"]}>
                  <div className={styles["code-header"]}>
                    <CopyButton
                      text={String(children)}
                    />
                  </div>
                <SyntaxHighlighter
                  //children={String(children).replace(/\n$/, "")}
                  style={atomDark}
                  className={styles["syntax-highlighter"]}
                  wrapLines={true}
                  showLineNumbers={true}
                  useInlineStyles={true}
                  lineProps={applyHighlights}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >{String(children).replace(/\n$/, "")}</SyntaxHighlighter>
              </div>
            );
          } else if (!inline) {
            return (
              <div className={styles["code-box"]}>
                  <div className={styles["code-header"]}>
                    <CopyButton
                      text={String(children)}
                    />
                  </div>
                <SyntaxHighlighter
                  //children={String(children).replace(/\n$/, "")}
                  style={atomDark}
                  className={styles["syntax-highlighter"]}
                  wrapLines={true}
                  showLineNumbers={true}
                  useInlineStyles={true}
                  lineProps={applyHighlights}
                  language={"text"}
                  PreTag="div"
                  {...props}
                >{String(children).replace(/\n$/, "")}</SyntaxHighlighter>
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
    >{mdChildren}</ReactMarkdown>
  );
}

export default MarkDown;