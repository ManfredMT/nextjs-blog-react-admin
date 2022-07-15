import Link from 'next/link';
import {getAllTags} from '../lib/posts'

export default function Tags({allTags}) {
    console.log('allTags: ',allTags)
    return <main>
        <label>标签:</label>
        {allTags.map((tag)=>{
            return <span key={tag.tagName}>{tag.tagName}</span>
        })}
    </main>
}

export async function getStaticProps() {
    const allTags = await getAllTags();
    return {
        props: {
            allTags
        }
    }

}