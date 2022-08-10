import styles from "../styles/LoadMoreBtn.module.css";

export default function LoadMoreBtn({onClick, text}) {
  return (
    <div className={styles["container"]}>
      <div className={styles["center"]}>
        <button className={styles["btn"]} onClick={onClick}>
          <svg width="180px" height="60px" viewBox="0 0 180 60" className={styles["border"]}>
            <polyline points="179,1 179,59 1,59 1,1 179,1" className={styles["bg-line"]} />
            <polyline points="179,1 179,59 1,59 1,1 179,1" className={styles["hl-line"]} />
          </svg>
          <span>{text}</span>
        </button>
      </div>
    </div>
  );
}
