import { getAllTags, getPostsByTag } from "../../lib/posts";
import { getSiteMetadata } from "../../lib/siteData";
import { TagSEO } from "../../components/SEO";
import generateRss from "../../lib/generate-rss";
import fs from "fs";
import path from "path";
import styles from "../../styles/TagPage.module.css";
import PostList from "../../components/PostList";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const root = process.cwd();
const DISPLAY_POST_NUMBER = 5;

export default function PostByTag({ postsData, siteMetadata, tag }) {
  return (
    <>
      <TagSEO
        title={`${tag} - ${siteMetadata.author}`}
        description={`${tag} tags - ${siteMetadata.author}`}
        siteUrl={siteMetadata.siteUrl}
        siteName={siteMetadata.name}
        socialBanner={siteMetadata.socialBanner}
      />
      <Header siteMetadata={siteMetadata} nav="tags" />
      <main>
      <h3 className={styles["tag-page-title"]}>{`标签 : ${tag}`}</h3>
      <div className={styles["post-list-wrap"]}>
            <PostList posts={postsData} displayN={DISPLAY_POST_NUMBER} />
      </div>

      </main>
      <Footer siteMetadata={siteMetadata} />
    </>
  );
}

export async function getStaticPaths() {
  const allTags = await getAllTags();
  const paths = allTags.map((t) => {
    return {
      params: {
        tag: t.tagName,
      },
    };
  });
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const postsData = await getPostsByTag(params.tag);
  const siteMetadata = await getSiteMetadata();
  const sortedPosts = postsData.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const filteredPosts = sortedPosts.map((post)=>{
    return {
      date: post.createdAt,
      title: post.title,
      summary: post.summary??'',
      tags:post.tags,
      category:post.category
    }
  })

  // rss
  if (filteredPosts.length > 0) {
    const rss = generateRss(
      filteredPosts,
      siteMetadata,
      `tags/${params.tag}/feed.xml`
    );
    const rssPath = path.join(root, "public", "tags", params.tag);
    fs.mkdirSync(rssPath, { recursive: true });
    fs.writeFileSync(path.join(rssPath, "feed.xml"), rss);
  }

  return {
    props: {
      postsData,
      siteMetadata,
      tag: params.tag,
    },
  };
}
