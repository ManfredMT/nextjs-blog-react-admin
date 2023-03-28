import styles from "../styles/PostLayout.module.css";
import Link from "next/link";
//import dynamic from "next/dynamic";
import { useEffect } from 'react';
import * as tocbot from 'tocbot';
import MarkDown from "./MarkDown";

// const MarkDown = dynamic(() => import("./MarkDown"), {
//   loading: () => {
//     return <p>加载中...</p>;
//   },
// });

export default function PostLayout({ post, siteMetadata }) {
  const postCreatedDate = new Date(post.createdAt);
  const postUpdatedDate = new Date(post.updatedAt);
  const formatCreated = `${postCreatedDate.getFullYear()}年${
    postCreatedDate.getMonth() + 1
  }月${postCreatedDate.getDate()}日`;
  const formatUpdated = `${postUpdatedDate.getFullYear()}年${
    postUpdatedDate.getMonth() + 1
  }月${postUpdatedDate.getDate()}日`;

  useEffect(()=>{
    tocbot.init({
      // Where to render the table of contents.
      tocSelector: '.toc',
      // Where to grab the headings to build the table of contents.
      contentSelector: '.toc-content',
      // Which headings to grab inside of the contentSelector element.
      headingSelector: 'h1, h2, h3',
      // For headings inside relative or absolute positioned containers within content.
      hasInnerContainers: true,
      headingsOffset: 60,
      scrollSmoothOffset: -60
    });
    return ()=>{
      tocbot.destroy();
    }
  },[])

  return (
    <div className={styles["layout-wrap"]}>
      <div className={styles["article-and-next"]}>
        <article>
          <header>
            <h2 className={styles["post-title"]}>{post.title}</h2>
            <div className={styles["authors-box"]}>
              {post.authors.map((author) => {
                if (author === "default") {
                  return (
                    <p className={styles["author"]} key={author}>
                      <img
                        className={styles["default-author-avatar"]}
                        src={siteMetadata.avatar}
                        width={20}
                        height={20}
                        alt="avatar"
                      />
                      {siteMetadata.author}
                    </p>
                  );
                } else {
                  return (
                    <p className={styles["author"]} key={author}>
                      <span className="icon-user"></span>
                      {author}
                    </p>
                  );
                }
              })}
            </div>
            {post.tags.length > 0 ? (
              <div className={styles["tags-box"]}>
                {post.tags.map((tag) => {
                  return (
                    <Link key={tag} href={`/tags/${tag}`}>
                      <span className={styles["post-tag"]} key={tag}>
                        {tag}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
            <time
              className={styles["time"]}
            >{`发布时间 : ${formatCreated}`}</time>
            <time
              className={styles["time"]}
            >{`更新时间 : ${formatUpdated}`}</time>
            <Link href={`/categories/${post.category}`}>
              <p className={styles["post-category"]}>
                <span className="icon-drawer"></span>
                {post.category === "default" ? "未分类" : post.category}
              </p>
            </Link>
          </header>
          <div className={styles["toc-and-md"]}>
            <div className={styles["md-toc"]}>
              <p className={styles["menu-head"]}>目录: </p>
              <div className="toc"></div>
            </div>
            <div className={`${styles["md-box"]} toc-content`}>
            {/* <Suspense fallback={`Loading...`}> */}
            <MarkDown mdChildren={post.content} />
            {/* </Suspense> */}
            </div>
          </div> 
          
        </article>
        <div className={styles["post-nav-box"]}>
          {post.lastPost ? (
            <Link href={`/posts/${post.lastPost}`}>
              <div className={styles["last-post-box"]}>
                <span>上一篇</span>
                <h3 className={styles["post-nav-title"]}>{post.lastPost}</h3>
              </div>
            </Link>
          ) : (
            <div className={`${styles["last-post-box"]} ${styles["no-cursor"]}`}></div>
          )}
          {post.nextPost ? (
            <Link href={`/posts/${post.nextPost}`}>
              <div className={styles["next-post-box"]}>
                <span>下一篇</span>
                <h3 className={styles["post-nav-title"]}>{post.nextPost}</h3>
              </div>
            </Link>
          ) : (
            <div className={`${styles["next-post-box"]} ${styles["no-cursor"]}`}></div>
          )}
        </div>
      </div>
    </div>
  );
}
