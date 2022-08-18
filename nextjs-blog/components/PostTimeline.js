import Link from "next/link";
import styles from "../styles/PostTimeline.module.css";

export default function PostTimeline({ postArchiveData }) {
  return (
    <div className={styles["post-timeline-wrap"]}>
      <ul className={styles["timeline"]}>
        {postArchiveData.map((archive) => {
          return (
            <li key={archive.date} className={styles["timeline-event"]}>
              <label className={styles["timeline-event-icon"]}></label>
              <div className={styles["timeline-event-copy"]}>
                <p className={styles["timeline-event-thumbnail"]}>
                  {archive.date}
                </p>
                {archive.posts.map((post) => {
                  return (
                    <h4 className={styles["post-title"]} key={post.id}>
                      <Link href={`/posts/${post.title}`}>{post.title}</Link>
                    </h4>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
