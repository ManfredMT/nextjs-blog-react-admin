import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { getAllPostsData, getPostRelatedPath } from "../lib/posts";
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

const DISPLAY_POST_NUMBER = 5;

export default function Home({ allPostsData, siteMetadata }) {
  console.log("allPostsData: ", allPostsData);
  console.log("metadata: ", siteMetadata);
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

          {/* <div className={styles["search-box-wrap"]}>
            <input 
            placeholder="搜索文章标题..."
            type="search" 
            id="title-search" 
            name="title-search"></input>
            <button>搜索</button>

          </div> */}

          <hr className={styles["search-post-hr"]} />

          <div className={styles["post-list-wrap"]}>
            <PostList posts={filteredPosts} displayN={DISPLAY_POST_NUMBER} />
          </div>
          {/* {allPostsData.map((post) => {
            return (
              <article key={post._id}>
                <header>
                  <h2>
                    <Link href={`/posts/${post.title}`}>{post.title}</Link>
                  </h2>
                  <p>{post.createdAt}</p>
                  {post.tags.length > 0 ? (
                    <div>
                      {post.tags.map((tag) => {
                        return <span key={tag}>{tag}</span>;
                      })}
                    </div>
                  ) : null}
                </header>
              </article>
            );
          })} */}
        </main>

        <Footer siteMetadata={siteMetadata} />

        {/* <footer className={styles["footer"]}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <span className={styles["logo"]}>
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </a>
        </footer> */}
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
    //fs.writeFileSync("./public/feed.xml", rss);
  }

  //debug
  const postRelatedPath = await getPostRelatedPath();
  console.log("postRelatedPath: ", postRelatedPath);

  return {
    props: {
      allPostsData,
      siteMetadata,
    },
  };
}
