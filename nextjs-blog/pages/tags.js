import Link from "next/link";
import { getAllTags } from "../lib/posts";
import { getSiteMetadata } from "../lib/siteData";
import { PageSEO } from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Tags.module.css";
import styleAni from "../styles/AnimatePublic.module.css";

export default function Tags({ allTags, siteMetadata }) {
  //console.log("allTags: ", allTags);
  return (
    <>
      <PageSEO
        title={`标签 - ${siteMetadata.author}`}
        description={siteMetadata.description}
        siteUrl={siteMetadata.siteUrl}
        siteName={siteMetadata.name}
        socialBanner={siteMetadata.socialBanner}
      />
      <Header siteMetadata={siteMetadata} nav="tags" />
      <main className={`${styles["tags-page-main"]} ${styleAni["fade-in-top"]}`}>
        {/* <label className={styles["tag-label"]}>{`标签 : `}</label> */}
        <div className={styles["tags-box"]}>
        {allTags.map((tag) => {
          return (
            <Link key={tag.tagName} href={`/tags/${tag.tagName}`}>
              <span  className={styles["tag"]}>
                {tag.tagName}<span className={styles["post-number"]}>{tag.value}</span>
              </span>
            </Link>
          );
        })}</div>
      </main>
      <Footer siteMetadata={siteMetadata} />
    </>
  );
}

export async function getStaticProps() {
  const allTags = await getAllTags();
  const siteMetadata = await getSiteMetadata();
  return {
    props: {
      allTags,
      siteMetadata,
    },
  };
}
