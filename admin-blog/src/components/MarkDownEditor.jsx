import "easymde/dist/easymde.min.css";
import "github-markdown-css";
import { useMemo, useState, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import ReactMarkdown from "react-markdown";
import SimpleMDE from "react-simplemde-editor";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import style from "../css/MarkDownEditor.module.css";
import remarkFootnotes from "remark-footnotes";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import rangeParser from "parse-numeric-range";

function MarkDownEditor({
  value=null,
  onChange=null,
  id = "post_content",
  autoSave = false,
}) {
  const mdeOptions = useMemo(() => {
    return {
      autofocus: false,
      spellChecker: false,
      sideBySideFullscreen: false,
      autosave: {
        enabled: autoSave,
        uniqueId: id,
        delay: 1000,
      },
      showIcons: [
        "code",
        "strikethrough",
        "table",
        "horizontal-rule",
        "undo",
        "redo",
      ],
      previewRender(value) {
        return ReactDOMServer.renderToString(
          <ReactMarkdown
            className={`${style["preview-body"]} markdown-body`}
            children={value}
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
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  style={atomDark}
                  wrapLines={true}// span {display:block}
                  showLineNumbers={true}
                  useInlineStyles={true}
                  lineProps={applyHighlights}
                  language={"text"}
                  PreTag="div"
                  {...props}
                />
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
      },
    };
  }, [autoSave,id]);
  return (
    <SimpleMDE id={id} options={mdeOptions} value={value} onChange={onChange} />
  );
}

export default MarkDownEditor;
