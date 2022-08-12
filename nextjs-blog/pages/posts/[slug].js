import { getPostByTitle, getAllPostTitles } from "../../lib/posts";
import Comment from "../../components/Comments";
import CommentForm from "../../components/CommentForm";
import { getSiteMetadata } from "../../lib/siteData";
import { BlogSEO } from "../../components/SEO";
import PostLayout from "../../components/PostLayout";
import ShrinkHeader from "../../components/ShrinkHeader";
import Footer from "../../components/Footer"

export default function Post({ post, siteMetadata }) {
  console.log("post: ", post);
  console.log("post.updatedAt: ",post.updatedAt)
  const authorDetails = post.authors ? post.authors.map((author)=>{
    const name = author==='default'?siteMetadata.author:author;
    return {name};
  }):null;
  const postTitle = post.title.length > 32?post.title.substr(0,32)+"...":post.title;
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
        <CommentForm postId={post._id} />
        <Comment postId={post._id} />
      </main>
      <Footer siteMetadata={siteMetadata} />
    </>
  );
}

export async function getStaticPaths() {
  const paths = await getAllPostTitles();
  return {
    paths,
    fallback: false,
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

  return {
    props: {
      post:posts[0],
      siteMetadata,
    },
  };
}
