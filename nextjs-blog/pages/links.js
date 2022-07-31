import { getAllLinksData } from "../lib/linksData";
import { getSiteMetadata } from "../lib/siteData";
import { PageSEO } from "../components/SEO";

export default function Links({ allLinks, siteMetadata }) {
  console.log("allLinks: ", allLinks);
  return (
    <>
      <PageSEO
        title={`友情链接 - ${siteMetadata.author}`}
        description={siteMetadata.description}
        siteUrl={siteMetadata.siteUrl}
        siteName={siteMetadata.name}
        socialBanner={siteMetadata.socialBanner}
      />
      <main>友链</main>
    </>
  );
}

export async function getStaticProps() {
  const allLinks = await getAllLinksData();
  const siteMetadata = await getSiteMetadata();
  return {
    props: {
      allLinks,
      siteMetadata,
    },
  };
}
