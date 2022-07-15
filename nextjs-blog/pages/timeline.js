import {getAllPostsData} from '../lib/posts';

export default function TimeLine({allPostsData}) {
    return <main>
        {allPostsData.map((post)=>{
          return <article key={post._id}>
            <header>
              <h2>{post.title}</h2>
              <p>{post.createdAt}</p>
              {post.tags.length>0?<div>
              {post.tags.map((tag)=>{
                return <span key={tag}>{tag}</span>
              })}
              </div>:null}
            </header>
          </article>
        })}
    </main>;
}

export async function getStaticProps() {
    const allPostsData = await getAllPostsData();
    return {
      props: {
        allPostsData,
      }
    }
  }