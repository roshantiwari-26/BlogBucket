import { Link, useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className={styles.mainContainer}>
      <div className={styles.card}>
        <div className={styles.badge}>404</div>

        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.subtitle}>
          Oops! The page you are looking for doesn't exist, has been removed, or
          is temporarily unavailable.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryBtn}>
            Back to Home
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.secondaryBtn}
          >
            Previous Page
          </button>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
