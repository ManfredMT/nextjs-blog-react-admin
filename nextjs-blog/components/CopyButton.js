import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import styles from "../styles/CopyButton.module.css";

function CopyButton({ text }) {
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
        if (result) {
          setCopied(true);
        }
      }}
    >
      {copied ? (
        <span
          title="复制成功"
          alt="copied"
          className={"icon-clipboard" + " " + styles["copied"]}
        />
      ) : (
        <span
          title="复制"
          className={"icon-paste" + " " + styles["copy-button"]}
          alt="copy"
        />
      )}
    </CopyToClipboard>
  );
}

export default CopyButton;
