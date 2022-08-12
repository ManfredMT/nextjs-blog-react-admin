import styles from "../styles/Header.module.css";
import Link from "next/link";


const STATIC_FILE_SERVER_URL = "http://localhost:5000";

export default function Header({siteMetadata, nav, shrink, postTitle}) {
  return (
    <header className={styles["header"]}>
    <div className={`${styles["inner-header"]} ${shrink?styles["shrink-header"]:null}`}>
      <h1 className={styles["logo-h1"]}>
        <Link href={siteMetadata.siteUrl}>
          <img
            height={128}
            width={128}
            className={styles["logo-img"]}
            src={STATIC_FILE_SERVER_URL + siteMetadata.logo}
            alt={siteMetadata.name}
          />
        </Link>
      </h1>

      {postTitle?<span className={styles["header-post-title"]}>{postTitle}</span>:null}

      <nav className={styles["header-nav"]}>
        <ul className={styles["nav-ul"]}>
          <li className={styles["ul-li"]}>
            <Link href="/">首页</Link>
            {nav==="home"?<div className={styles["menu-bottom-bar"]}></div>:null}
          </li>
          <li className={styles["ul-li"]}>
            <Link href="/tags">标签</Link>
            {nav==="tags"?<div className={styles["menu-bottom-bar"]}></div>:null}
          </li >
          <li className={styles["ul-li"]}>
            <Link href="/categories">分类</Link>
            {nav==="categories"?<div className={styles["menu-bottom-bar"]}></div>:null}
          </li>
          <li className={styles["ul-li"]}>
            <Link href="/timeline">归档</Link>
            {nav==="timeline"?<div className={styles["menu-bottom-bar"]}></div>:null}
          </li>
          <li className={styles["ul-li"]}>
            <Link href="/links">友链</Link>
            {nav==="links"?<div className={styles["menu-bottom-bar"]}></div>:null}
          </li>
        </ul>
      </nav></div>
    </header>
  );
}
