import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkFootnotes from "remark-footnotes";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rangeParser from "parse-numeric-range";
import CopyButton from "./CopyButton";

function MDComponent({
  reactMDClass,
  mdChildren,
  codeBoxClass,
  syntaxHLClass,
  hasCopyButton,
  codeHeaderClass,
  classCopied,
  classCopy,
}) {
  return (
    <ReactMarkdown
      className={reactMDClass}
      children={mdChildren}
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
              <div className={codeBoxClass}>
                {hasCopyButton ? (
                  <div className={codeHeaderClass}>
                    <CopyButton
                      classCopied={classCopied}
                      classCopy={classCopy}
                      text={String(children)}
                    />
                  </div>
                ) : null}
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  style={atomDark}
                  className={syntaxHLClass}
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
              <div className={codeBoxClass}>
                {hasCopyButton ? (
                  <div className={codeHeaderClass}>
                    <CopyButton
                      classCopied={classCopied}
                      classCopy={classCopy}
                      text={String(children)}
                    />
                  </div>
                ) : null}
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  style={atomDark}
                  className={syntaxHLClass}
                  wrapLines={true}
                  showLineNumbers={true}
                  useInlineStyles={true}
                  lineProps={applyHighlights}
                  language={"text"}
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
}

export default MDComponent;
