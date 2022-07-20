import { getPostById, getAllPostIds } from "../../lib/posts";
import Comment from "../../components/Comments";
import CommentForm from "../../components/CommentForm";

export default function Post({ post }) {
  console.log("post: ", post);
  return (
    <main>
      <Comment postId={post[0]._id} />
      <CommentForm postId={post[0]._id} />
    </main>
  );
}

export async function getStaticPaths() {
  const paths = await getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostById(params.id);
  return {
    props: {
      post,
    },
  };
}
