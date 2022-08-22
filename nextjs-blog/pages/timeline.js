import { getMonthArchive } from "../lib/posts";
import { getSiteMetadata } from "../lib/siteData";
import { PageSEO } from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PostTimeline from "../components/PostTimeline";
import styleAni from "../styles/AnimatePublic.module.css";

export default function Timeline({ postArchiveData, siteMetadata }) {
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
