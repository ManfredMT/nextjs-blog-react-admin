import { getAllCategories } from "../lib/posts";
import Link from "next/link";
import { getSiteMetadata } from "../lib/siteData";
import { PageSEO } from "../components/SEO";

export default function Categories({ allCategories, siteMetadata }) {
  console.log("allCategories: ", allCategories);
  return (
    <>
      <PageSEO
        title={`分类 - ${siteMetadata.author}`}
        description={siteMetadata.description}
        siteUrl={siteMetadata.siteUrl}
        siteName={siteMetadata.name}
        socialBanner={siteMetadata.socialBanner}
      />
      <main>
        <label>分类:</label>
        <div>
          {allCategories.map((category) => {
            return (
              <p key={category}>
                <Link href={`/categories/${category}`}>
                  {category === "default" ? "未分类" : category}
                </Link>
              </p>
            );
          })}
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const allCategories = await getAllCategories();
  const siteMetadata = await getSiteMetadata();
  return {
    props: {
      allCategories,
      siteMetadata,
    },
  };
}
