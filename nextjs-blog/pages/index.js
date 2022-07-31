import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { getAllPostsData } from "../lib/posts";
import { getSiteMetadata } from "../lib/siteData";
import { PageSEO } from "../components/SEO";
import generateRss from "../lib/generate-rss";
import fs from "fs";
import path from "path";

const root = process.cwd();


const DISPLAY_POST_NUMBER = 5;

export default function Home({ allPostsData, siteMetadata }) {
  console.log("allPostsData: ", allPostsData);
  console.log("metadata: ",siteMetadata);
  return (
    <>
      <PageSEO
        title={siteMetadata.title}
        description={siteMetadata.description}
        siteUrl={siteMetadata.siteUrl}
        siteName={siteMetadata.name}
        socialBanner={siteMetadata.socialBanner}
      />
      <div className={styles.container}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header>
          <div>
            <div className={styles["image-placeholder"]}></div>
            <h1>博客主页</h1>
          </div>
          <nav>
            <ul>
              <li>
                <Link href="/">主页</Link>
              </li>
              <li>
                <Link href="/tags">标签</Link>
              </li>
              <li>
                <Link href="/categories">分类</Link>
              </li>
              <li>
                <Link href="/timeline">归档</Link>
              </li>
              <li>
                <Link href="/links">友链</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className={styles.main}>
          <div>
            <input type="search"></input>
          </div>

          <hr />

          {allPostsData.map((post) => {
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
          })}
        </main>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <span className={styles.logo}>
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </a>
        </footer>
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
  const allPosts = sortedPosts.map((post)=>{
    return {
      date: post.createdAt,
      title: post.title,
      summary: post.summary??'',
      tags:post.tags,
      category:post.category
    }
  })

  // rss
  if (allPosts.length > 0) {
    const rss = generateRss(allPosts, siteMetadata);
    const rssPath = path.join(root, "public", "feed.xml");
    fs.writeFileSync(rssPath, rss);
    //fs.writeFileSync("./public/feed.xml", rss);
  }

  return {
    props: {
      allPostsData,
      siteMetadata,
    },
  };
}
