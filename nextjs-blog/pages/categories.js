import {getAllCategories} from '../lib/posts'
export default function Categories({allCategories}) {
    console.log("allCategories: ",allCategories)
    return <main><label>分类:</label><div>
        {allCategories.map((category)=>{
            return <p key={category}>{category==='default'?'未分类':category}</p>
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