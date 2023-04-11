import { getAllCategories } from "../lib/posts";
import Link from "next/link";
import { getSiteMetadata } from "../lib/siteData";
import { PageSEO } from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Categories.module.css";
import styleAni from "../styles/AnimatePublic.module.css";

export default function Categories({ allCategories, siteMetadata }) {
  return (
    <>
      <PageSEO
        title={`分类 - ${siteMetadata.author}`}
        description={siteMetadata.description}
        siteUrl={siteMetadata.siteUrl}
        siteName={siteMetadata.name}
        socialBanner={siteMetadata.socialBanner}
      />
      <Header siteMetadata={siteMetadata} nav="categories" />

      <main className={`${styles["categories-page-main"]} ${styleAni["fade-in-top"]}`}>
        {/* <label
          className={styles["total-num-label"]}
        >{`共${allCategories.length}个分类`}</label> */}
        <div className={styles["all-category-box"]}>
          {allCategories.map((category) => {
            return (
              <p key={category} className={styles["category"]}>
                <Link href={`/categories/${category}`}>
                  {`\u00A0\u00A0${category === "default" ? "未分类" : category}\u00A0\u00A0`}
                </Link>
              </p>
            );
          })}
        </div>
      </main>

      <Footer siteMetadata={siteMetadata} />
    </>
  );
}

export async function getStaticProps() {
  const allCategories = await getAllCategories();
  const siteMetadata = await getSiteMetadata();
  return {
    props: {
      allCategories,
      siteMetadata,
    },
  };
}
