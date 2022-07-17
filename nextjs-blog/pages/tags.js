import Link from "next/link";
import { getAllTags } from "../lib/posts";

export default function Tags({ allTags }) {
  console.log("allTags: ", allTags);
  return (
    <main>
      <label>标签:</label>
      {allTags.map((tag) => {
        return (
          <span key={tag.tagName}>
            <Link href={`/tags/${tag.tagName}`}>{tag.tagName}</Link>
          </span>
        );
      })}
    </main>
  );
}

export async function getStaticProps() {
  const allTags = await getAllTags();
  return {
    props: {
      allTags,
    },
  };
}
