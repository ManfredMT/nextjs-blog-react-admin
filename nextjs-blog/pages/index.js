import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { getAllPostsData } from "../lib/posts";
import { getSiteMetadata } from "../lib/siteData";
import { PageSEO } from "../components/SEO";
import generateRss from "../lib/generate-rss";
import fs from "fs";
import path from "path";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PostList from "../components/PostList";
import Footer from "../components/Footer";

const root = process.cwd();

const DISPLAY_POST_NUMBER = 10;

export default function Home({ allPostsData, siteMetadata }) {
  const [searchValue, setSearchValue] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(allPostsData);
  const onChange = (e) => {
    setSearchValue(e.target.value);
  };
  const onClickSearch = () => {
    setFilteredPosts(
      allPostsData.filter((post) => post.title.includes(searchValue))
    );
  };
  return (
    <>
      <PageSEO
        title={siteMetadata.title}
        description={siteMetadata.description}
        siteUrl={siteMetadata.siteUrl}
        siteName={siteMetadata.name}
        socialBanner={siteMetadata.socialBanner}
      />
      <div className={styles["container"]}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header siteMetadata={siteMetadata} nav="home" />

        <main className={styles["main"]}>
          <SearchBar
            value={searchValue}
            onChange={onChange}
            onClickSearch={onClickSearch}
            className={styles["search-bar-wrap"]}
          />

          <hr className={styles["search-post-hr"]} />

          <div className={styles["post-list-wrap"]}>
            <PostList posts={filteredPosts} displayN={DISPLAY_POST_NUMBER} />
          </div>
        </main>

        <Footer siteMetadata={siteMetadata} />
      </div>
    </>
  );
}

export async function getStaticProps() {
  const allPostsData = await getAllPostsData();
  const siteMetadata = await getSiteMetadata();

  const sortedPosts = allPostsData.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const allPosts = sortedPosts.map((post) => {
    return {
      date: post.createdAt,
      title: post.title,
      summary: post.summary ?? "",
      tags: post.tags,
      category: post.category,
    };
  });

  // rss
  if (allPosts.length > 0) {
    const rss = generateRss(allPosts, siteMetadata);
    const rssPath = path.join(root, "public", "feed.xml");
    fs.writeFileSync(rssPath, rss);
  }

  //debug
  // const postRelatedPath = await getPostRelatedPath();
  //console.log("postRelatedPath: ", postRelatedPath);

  return {
    props: {
      allPostsData,
      siteMetadata,
    },
  };
}
