import { getAllCategories, getPostsByCategory } from "../../lib/posts";
import { getSiteMetadata } from "../../lib/siteData";
import { CategorySEO } from "../../components/SEO";
import generateRss from "../../lib/generate-rss";
import fs from "fs";
import path from "path";

const root = process.cwd();

export default function PostByCategory({
  postsByCategory,
  siteMetadata,
  category,
}) {
  console.log("postsByCategory: ", postsByCategory);
  return (
    <>
      <CategorySEO
        title={`${category} - ${siteMetadata.author}`}
        description={`${category} categories - ${siteMetadata.author}`}
        siteUrl={siteMetadata.siteUrl}
        siteName={siteMetadata.name}
        socialBanner={siteMetadata.socialBanner}
      />
      <main>{category}</main>
    </>
  );
}

export async function getStaticPaths() {
  const allCategories = await getAllCategories();
  const paths = allCategories.map((category) => {
    return {
      params: {
        category,
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postsByCategory = await getPostsByCategory(params.category);
  const siteMetadata = await getSiteMetadata();
  const sortedPosts = postsByCategory.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const filteredPosts = sortedPosts.map((post) => {
    return {
      date: post.createdAt,
      title: post.title,
      summary: post.summary ?? "",
      tags: post.tags,
      category: post.category,
    };
  });

  // rss
  console.log("filteredPosts: ",filteredPosts);
  if (filteredPosts.length > 0) {
    const rss = generateRss(
      filteredPosts,
      siteMetadata,
      `categories/${params.category}/feed.xml`
    );
    console.log("rss: ", rss);
    const rssPath = path.join(root, "public", "categories", params.category);
    console.log("rssPath: ",rssPath);
    fs.mkdirSync(rssPath, { recursive: true });
    fs.writeFileSync(path.join(rssPath, "feed.xml"), rss);
  }

  return {
    props: {
      postsByCategory,
      siteMetadata,
      category: params.category,
    },
  };
}
