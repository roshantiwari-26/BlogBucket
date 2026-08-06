import { useContext, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./Header.module.css";

const avatarPlaceholder = "/avatar.svg";
const logoSrc = "/BlogBucket-logo.png";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const [showAuthBox, setShowAuthBox] = useState(false);

  function toggleAuthBox() {
    setShowAuthBox((prev) => !prev);
  }

  const getAvatarSrc = () => {
    if (!user?.profile_picture) return avatarPlaceholder;
    if (user.profile_picture.startsWith("http")) return user.profile_picture;
    return `https://blogbucket-api.onrender.com/uploads${
      user.profile_picture.startsWith("/") ? "" : "/"
    }${user.profile_picture}`;
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <img src={logoSrc} alt="BlogBucket Logo" className={styles.logo} />
        <h1 className={styles.title}>BlogBucket</h1>
      </Link>

      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          Home
        </NavLink>

        {user ? (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Profile
          </NavLink>
        ) : (
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Register
          </NavLink>
        )}

        {user && (
          <NavLink
            to="/create-post"
            className={({ isActive }) =>
              `${styles.createButton} ${isActive ? styles.createActive : ""}`
            }
          >
            + Create Post
          </NavLink>
        )}
      </nav>

      <div className={styles.userProfileContainer}>
        <button
          type="button"
          className={styles.avatarButton}
          onClick={toggleAuthBox}
          aria-expanded={showAuthBox}
          aria-label="User navigation menu"
        >
          <img
            src={getAvatarSrc()}
            alt="User Avatar"
            className={styles.avatar}
          />
        </button>

        <div
          className={`${styles.authBox} ${
            showAuthBox ? styles.authBoxOpen : ""
          }`}
        >
          {user ? (
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={() => {
                logout();
                setShowAuthBox(false);
              }}
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className={styles.loginLink}
              onClick={() => setShowAuthBox(false)}
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
