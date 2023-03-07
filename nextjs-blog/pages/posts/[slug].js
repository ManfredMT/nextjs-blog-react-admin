import { getPostByTitle, getAllPostTitles } from "../../lib/posts";
import { getSiteMetadata } from "../../lib/siteData";
import { BlogSEO } from "../../components/SEO";
import PostLayout from "../../components/PostLayout";
import ShrinkHeader from "../../components/ShrinkHeader";
import Footer from "../../components/Footer";
import CommentSection from "../../components/CommentSection";

export default function Post({ post, siteMetadata }) {
  const authorDetails = post.authors
    ? post.authors.map((author) => {
        const name = author === "default" ? siteMetadata.author : author;
        return { name };
      })
    : null;
  const postTitle =
    post.title.length > 22 ? post.title.substr(0, 22) + "..." : post.title;
  return (
    <>
      <BlogSEO
        authorDetails={authorDetails}
        title={post.title}
        summary={post.summary ?? ""}
        date={post.createdAt}
        lastmod={post.updatedAt}
        url={`${siteMetadata.siteUrl}/posts/${post.title}`}
        canonicalUrl={
          post.canonicalUrl ?? `${siteMetadata.siteUrl}/posts/${post.title}`
        }
        siteUrl={siteMetadata.siteUrl}
        siteName={siteMetadata.name}
        socialBanner={siteMetadata.socialBanner}
        author={siteMetadata.author}
        siteLogo={siteMetadata.logo}
      />
      <ShrinkHeader siteMetadata={siteMetadata} postTitle={postTitle} />
      <main>
        <PostLayout post={post} siteMetadata={siteMetadata} />
        <CommentSection postId={post._id} />
      </main>
      <Footer siteMetadata={siteMetadata} />
    </>
  );
}

export async function getStaticPaths() {
  const paths = await getAllPostTitles();
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const posts = await getPostByTitle(params.slug);
  const siteMetadata = await getSiteMetadata();
  // const postsData = await getAllPostsData();
  // const sortedPosts = postsData.sort(
  //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  // );
  // const allPosts = sortedPosts.map((post)=>{
  //   return {
  //     date: post.createdAt,
  //     title: post.title,
  //     summary: post.summary??'',
  //     tags:post.tags,
  //     category:post.category
  //   }
  // })

  // rss
  // if (allPosts.length > 0) {
  //   const rss = generateRss(allPosts, siteMetadata);
  //   fs.writeFileSync("./public/feed.xml", rss);
  // }
  if(!posts.length) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      post: posts[0],
      siteMetadata,
    },
  };
}
