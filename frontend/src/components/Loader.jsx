import styles from "./Loader.module.css";

function Loader({ message = "Loading content, please wait..." }) {
  return (
    <div className={styles.loaderWrapper} role="status" aria-live="polite">
      <div className={styles.spinner}>
        <div className={styles.innerRing}></div>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default Loader;
