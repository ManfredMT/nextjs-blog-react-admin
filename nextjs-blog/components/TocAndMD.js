import * as tocbot from "tocbot";
import { useEffect } from "react";
import MarkDown from "./MarkDown";
import styles from "../styles/TocAndMD.module.css";

export default function TocAndMD({mdChildren}) {
  useEffect(() => {
    tocbot.init({
      // Where to render the table of contents.
      tocSelector: ".toc",
      // Where to grab the headings to build the table of contents.
      contentSelector: ".toc-content",
      // Which headings to grab inside of the contentSelector element.
      headingSelector: "h1, h2, h3",
      // For headings inside relative or absolute positioned containers within content.
      hasInnerContainers: true,
      headingsOffset: 60,
      scrollSmoothOffset: -60,
      collapseDepth:6 //目录不折叠
    });
    return () => {
      tocbot.destroy();
    };
  }, [mdChildren]);

  return (
    <div className={styles["toc-and-md"]}>
      <div className={styles["md-toc"]}>
        <p className={styles["menu-head"]}>目录: </p>
        <div className="toc" ></div>
      </div>
      <div className={`${styles["md-box"]} toc-content`}>
        {/* <Suspense fallback={`Loading...`}> */}
        <MarkDown mdChildren={mdChildren} />
        {/* </Suspense> */}
      </div>
    </div>
  );
}
