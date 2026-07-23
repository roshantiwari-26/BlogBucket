import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./Header.module.css";

function Header() {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className={styles.header}>
      <h1>BlogBucket</h1>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? `${styles.nav_button} ${styles.active}`
              : styles.nav_button
          }
        >
          Home
        </NavLink>

        {user ? (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? `${styles.nav_button} ${styles.active}`
                : styles.nav_button
            }
          >
            Profile
          </NavLink>
        ) : (
          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive
                ? `${styles.nav_button} ${styles.active}`
                : styles.nav_button
            }
          >
            Register
          </NavLink>
        )}

        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? `${styles.nav_button} ${styles.active}`
                : styles.nav_button
            }
          >
            Login
          </NavLink>
        )}
      </nav>
      <img
        src={
          user?.profile_picture
            ? `http://localhost:5000/uploads${user?.profile_picture}`
            : "../public/avatar.svg"
        }
      />
    </header>
  );
}

export default Header;
