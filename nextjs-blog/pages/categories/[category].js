import {getAllCategories, getPostsByCategory} from "../../lib/posts";

export default function PostByCategory({postsByCategory}) {
    console.log("postsByCategory: ",postsByCategory);
    return <main></main>
}

export async function getStaticPaths() {
    const allCategories = await getAllCategories();
    const paths = (allCategories).map((category)=>{
        return {
            params:{
                category 
            }
        };
    })
    return {
        paths,
        fallback: false,
    }
}

export async function getStaticProps({params}) {
    const postsByCategory = await getPostsByCategory(params.category);
    return {
        props: {
            postsByCategory
        }
    }
}