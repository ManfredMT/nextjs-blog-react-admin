import {getPostById, getAllPostIds} from "../../lib/posts";

export default function Post({post}) {
    console.log("post: ",post)
    return <main></main>
}

export async function getStaticPaths() {
    const paths = await getAllPostIds();
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({params}) {
    const post = await getPostById(params.id);
    return {
        props: {
            post
        }
    }
}