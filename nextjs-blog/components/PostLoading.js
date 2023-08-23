import styles from "../styles/PostLoading.module.css";

export default function PostLoading() {
  return (
    <div className={styles["loading-box"]}>
      <span className={styles["loading-text-p"]}>文章加载中</span>
      <div className={styles["lds-ellipsis"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
