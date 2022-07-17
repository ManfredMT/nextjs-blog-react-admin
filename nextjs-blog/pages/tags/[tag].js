import {getAllTags, getPostsByTag} from "../../lib/posts"

export default function PostByTag({postsData}) {
    console.log("postsData: ",postsData);
    return <main></main>

}

export async function getStaticPaths() {
    const allTags = await getAllTags();
    const paths = allTags.map((t)=>{
        return {
            params: {
                tag: t.tagName
            }
        };
    })
    return {
        paths,
        fallback: false,
    }
}

export async function getStaticProps({params}) {
    const postsData = await getPostsByTag(params.tag);
    return {
        props: {
            postsData
        }
    }

}