import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function registerUser(e) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);

      const errorMessage =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "Registration failed. Please check your information and try again.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.mainContainer}>
      <div className={styles.card}>
        <div className={styles.headerGroup}>
          <h1 className={styles.title}>Create an Account</h1>
          <p className={styles.subtitle}>
            Join BlogBucket to publish your stories and connect with writers
          </p>
        </div>

        {error && (
          <div className={styles.errorBanner} role="alert">
            <span>{error}</span>
          </div>
        )}

        <form className={styles.form} onSubmit={registerUser}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              value={name}
              required
              disabled={isLoading}
              className={styles.input}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              value={email}
              required
              disabled={isLoading}
              className={styles.input}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={password}
              required
              minLength={6}
              disabled={isLoading}
              className={styles.input}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading || !name || !email || !password}
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className={styles.cardFooter}>
          <p>
            Already have an account?{" "}
            <Link to="/login" className={styles.loginLink}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;
