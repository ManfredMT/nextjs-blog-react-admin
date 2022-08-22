import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import copySvg from "../images/copy-svgrepo-com.svg";
import copiedSvg from "../images/check-success-svgrepo-com.svg";

function CopyButton({ text, classCopy, classCopied }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);
  return (
    <CopyToClipboard
      text={text}
      onCopy={(text, result) => {
        console.log("copy text: ", text, result);
        if (result) {
          setCopied(true);
        }
      }}
    >
      {copied ? (
        <img title="复制成功" src={copiedSvg} alt="copied" className={classCopied} />
      ) : (
        <img
          title="复制"
          className={classCopy}
          src={copySvg}
          alt="copy"
        />
      )}
    </CopyToClipboard>
  );
}

export default CopyButton;
