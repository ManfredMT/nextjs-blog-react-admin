import styles from "../styles/Header.module.css";
import Link from "next/link";
import ThemeChanger from "./ThemeChanger";
import Image from "next/image";
import { useState } from "react";


export default function Header({ siteMetadata, nav, shrink, postTitle }) {
  const [showMobile, setShowMobile] = useState(false);
  const showMobileMenu = () => {
    setShowMobile(!showMobile);
  };
  return (
    <header className={`${styles["header"]} ${nav === "home" ? styles["header-home"]:""}`}>
      <div
        className={`${styles["inner-header"]} ${
          shrink ? styles["shrink-header"] : null
        }`}
      >
        <h1 className={styles["logo-h1"]}>
          <Link href="/">
            <a>
              <Image
                height={shrink ? 48 : 128}
                width={shrink ? 96 : 256}
                className={styles["logo-img"]}
                src={siteMetadata.logo}
                alt={siteMetadata.name}
              />
            </a>
          </Link>
        </h1>

        {postTitle ? (
          <span className={styles["header-post-title"]}>{postTitle}</span>
        ) : null}

        <nav className={styles["header-nav"]}>
          <div className={styles["mobile-nav-button"]} onClick={showMobileMenu}>
            <span className="icon-menu" />
          </div>
          {showMobile ? (
            <ul className={styles["mobile-nav-ul"]}>
              <li className=
              {`${styles["mobile-ul-li"]} ${nav === "home" ? styles["selected-nav-home"]:""}`}>
                <Link href="/">首页</Link>
              </li>
              <li className=
              {`${styles["mobile-ul-li"]} ${nav === "tags" ? styles["selected-nav"]:""}`}>
                <Link href="/tags">标签</Link>
              </li>
              <li className=
              {`${styles["mobile-ul-li"]} ${nav === "categories" ? styles["selected-nav"]:""}`}>
                <Link href="/categories">分类</Link>
              </li>
              <li className=
              {`${styles["mobile-ul-li"]} ${nav === "timeline" ? styles["selected-nav"]:""}`}>
                <Link href="/timeline">归档</Link>
              </li>
              <li className=
              {`${styles["mobile-ul-li"]} ${nav === "links" ? styles["selected-nav"]:""}`}>
                <Link href="/links">友链</Link>
              </li>
              <li className={styles["mobile-ul-li"]}>
                <ThemeChanger />
              </li>
            </ul>
          ) : null}
          <ul className={styles["nav-ul"]}>
            <li className={styles["ul-li"]}>
              <Link href="/">首页</Link>
              {nav === "home" ? (
                <div className={styles["menu-bottom-bar"]}></div>
              ) : null}
            </li>
            <li className={styles["ul-li"]}>
              <Link href="/tags">标签</Link>
              {nav === "tags" ? (
                <div className={styles["menu-bottom-bar"]}></div>
              ) : null}
            </li>
            <li className={styles["ul-li"]}>
              <Link href="/categories">分类</Link>
              {nav === "categories" ? (
                <div className={styles["menu-bottom-bar"]}></div>
              ) : null}
            </li>
            <li className={styles["ul-li"]}>
              <Link href="/timeline">归档</Link>
              {nav === "timeline" ? (
                <div className={styles["menu-bottom-bar"]}></div>
              ) : null}
            </li>
            <li className={styles["ul-li"]}>
              <Link href="/links">友链</Link>
              {nav === "links" ? (
                <div className={styles["menu-bottom-bar"]}></div>
              ) : null}
            </li>
            <li className={styles["ul-li"]}>
              <ThemeChanger />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
