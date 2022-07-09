import "easymde/dist/easymde.min.css";
import "github-markdown-css";
import { useMemo } from "react";
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
import 'katex/dist/katex.min.css';

function MarkDownEditor({ value, onChange }) {
  const mdeOptions = useMemo(() => {
    return {
      autofocus: false,
      spellChecker: false,
      sideBySideFullscreen: false,
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
      },
    };
  }, []);
  return <SimpleMDE options={mdeOptions} value={value} onChange={onChange} />;
}

export default MarkDownEditor;
