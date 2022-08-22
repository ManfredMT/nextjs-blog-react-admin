import { getAllCategories, getPostsByCategory } from "../../lib/posts";
import { getSiteMetadata } from "../../lib/siteData";
import { CategorySEO } from "../../components/SEO";
import generateRss from "../../lib/generate-rss";
import fs from "fs";
import path from "path";
import PostList from "../../components/PostList";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../../styles/CategoryPage.module.css";

const root = process.cwd();
const DISPLAY_POST_NUMBER = 5;

export default function PostByCategory({
  postsByCategory,
  siteMetadata,
  category,
}) {
  //console.log("postsByCategory: ", postsByCategory);
  return (
    <>
      <CategorySEO
        title={`${category} - ${siteMetadata.author}`}
        description={`${category} categories - ${siteMetadata.author}`}
        siteUrl={siteMetadata.siteUrl}
        siteName={siteMetadata.name}
        socialBanner={siteMetadata.socialBanner}
      />
      <Header siteMetadata={siteMetadata} nav="categories" />
      <main>
        <h3 className={styles["category-page-title"]}>{`分类 : ${
          category !== "default" ? category : "未分类"
        }`}</h3>
        <div className={styles["post-list-wrap"]}>
          <PostList posts={postsByCategory} displayN={DISPLAY_POST_NUMBER} />
        </div>
      </main>
      <Footer siteMetadata={siteMetadata} />
    </>
  );
}

export async function getStaticPaths() {
  const allCategories = await getAllCategories();
  const paths = allCategories.map((category) => {
    return {
      params: {
        category,
      },
    };
  });
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const postsByCategory = await getPostsByCategory(params.category);
  const siteMetadata = await getSiteMetadata();
  const sortedPosts = postsByCategory.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const filteredPosts = sortedPosts.map((post) => {
    return {
      date: post.createdAt,
      title: post.title,
      summary: post.summary ?? "",
      tags: post.tags,
      category: post.category,
    };
  });

  // rss
  if (filteredPosts.length > 0) {
    const rss = generateRss(
      filteredPosts,
      siteMetadata,
      `categories/${params.category}/feed.xml`
    );
    //console.log("rss: ", rss);
    const rssPath = path.join(root, "public", "categories", params.category);
    //console.log("rssPath: ", rssPath);
    fs.mkdirSync(rssPath, { recursive: true });
    fs.writeFileSync(path.join(rssPath, "feed.xml"), rss);
  }

  return {
    props: {
      postsByCategory,
      siteMetadata,
      category: params.category,
    },
  };
}
