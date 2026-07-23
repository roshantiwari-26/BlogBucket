import { useState } from "react";
import styles from "./Login.module.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function loginUser(e) {
    try {
      e.preventDefault();
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });
      console.log(data);
      login(data.user, data.accessToken);
      alert("Login successful");
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(err.response.data);
      setEmail("");
      setPassword("");
    }
  }

  return (
    <form className={styles.loginContainer} onSubmit={loginUser}>
      {error ? <h2>{error.message}</h2> : null}
      <div>
        <label htmlFor="email">Enter your email: </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          required
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
        />
      </div>
      <div>
        <label htmlFor="password">Enter your password: </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          required
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
        />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  );
}

export default Login;
