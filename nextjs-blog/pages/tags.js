import Link from "next/link";
import { getAllTags } from "../lib/posts";
import { getSiteMetadata } from "../lib/siteData";
import { PageSEO } from "../components/SEO";

export default function Tags({ allTags, siteMetadata }) {
  console.log("allTags: ", allTags);
  return (
    <>
      <PageSEO
        title={`标签 - ${siteMetadata.author}`}
        description={siteMetadata.description}
        siteUrl={siteMetadata.siteUrl}
        siteName={siteMetadata.name}
        socialBanner={siteMetadata.socialBanner}
      />
      <main>
        <label>标签:</label>
        {allTags.map((tag) => {
          return (
            <span key={tag.tagName}>
              <Link href={`/tags/${tag.tagName}`}>{tag.tagName}</Link>
            </span>
          );
        })}
      </main>
    </>
  );
}

export async function getStaticProps() {
  const allTags = await getAllTags();
  const siteMetadata = await getSiteMetadata();
  return {
    props: {
      allTags,
      siteMetadata,
    },
  };
}
