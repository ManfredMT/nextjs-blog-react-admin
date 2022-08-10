import { getAllPostsData } from "../lib/posts";
import { getSiteMetadata } from "../lib/siteData";
import { PageSEO } from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TimeLine({ allPostsData, siteMetadata }) {
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
      <main>
        {allPostsData.map((post) => {
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
        })}
      </main>
      <Footer siteMetadata={siteMetadata} />
    </>
  );
}

export async function getStaticProps() {
  const allPostsData = await getAllPostsData();
  const siteMetadata = await getSiteMetadata();
  return {
    props: {
      allPostsData,
      siteMetadata,
    },
  };
}
