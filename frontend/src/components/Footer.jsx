import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const logoSrc = "/BlogBucket-logo.png";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <Link to="/" className={styles.brandLink}>
              <img
                src={logoSrc}
                alt="BlogBucket Logo"
                className={styles.logo}
              />
              <span className={styles.title}>BlogBucket</span>
            </Link>
            <p className={styles.tagline}>
              Your hub for ideas, insights, and stories worth sharing.
            </p>
          </div>

          <div className={styles.navGroup}>
            <div className={styles.navColumn}>
              <h4 className={styles.columnTitle}>Navigation</h4>
              <Link to="/" className={styles.footerLink}>
                Home
              </Link>
              <Link to="/register" className={styles.footerLink}>
                Register
              </Link>
              <Link to="/login" className={styles.footerLink}>
                Login
              </Link>
            </div>

            <div className={styles.navColumn}>
              <h4 className={styles.columnTitle}>Platform</h4>
              <Link to="/create-post" className={styles.footerLink}>
                Write a Post
              </Link>
              <a href="#privacy" className={styles.footerLink}>
                Privacy Policy
              </a>
              <a href="#terms" className={styles.footerLink}>
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            © {currentYear} <span className={styles.author}>Roshan Tiwari</span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
