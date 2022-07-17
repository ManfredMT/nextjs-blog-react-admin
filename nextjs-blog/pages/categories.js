import {getAllCategories} from '../lib/posts';
import Link from "next/link";

export default function Categories({allCategories}) {
    console.log("allCategories: ",allCategories)
    return <main><label>分类:</label><div>
        {allCategories.map((category)=>{
            return <p key={category}><Link href={`/categories/${category}`}>{category==='default'?'未分类':category}</Link></p>
        })}
    </div></main>
}

export async function getStaticProps() {
    const allCategories = await getAllCategories();
    return {
        props:{
            allCategories
        }
    }

}