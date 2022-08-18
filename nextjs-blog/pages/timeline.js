import { getMonthArchive } from "../lib/posts";
import { getSiteMetadata } from "../lib/siteData";
import { PageSEO } from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PostTimeline from "../components/PostTimeline";
import styleAni from "../styles/AnimatePublic.module.css";

export default function Timeline({ postArchiveData, siteMetadata }) {
  console.log("postArchiveData: ", postArchiveData);
  return (
    <>
      <PageSEO
        title={`时间轴 - ${siteMetadata.author}`}
        description={siteMetadata.description}
        siteUrl={siteMetadata.siteUrl}
        siteName={siteMetadata.name}
        socialBanner={siteMetadata.socialBanner}
      />
      <Header siteMetadata={siteMetadata} nav="timeline" />
      <main className={styleAni["fade-in-top"]}>
        <PostTimeline postArchiveData={postArchiveData} />
        {/* {allPostsData.map((post) => {
          return (
            <article key={post._id}>
              <header>
                <h2>{post.title}</h2>
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
    </>
  );
}

export async function getStaticProps() {
  const postArchiveData = await getMonthArchive();
  const siteMetadata = await getSiteMetadata();
  return {
    props: {
      postArchiveData,
      siteMetadata,
    },
  };
}
