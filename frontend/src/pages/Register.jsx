import { useState } from "react";
import styles from "./Register.module.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function registerUser(e) {
    try {
      e.preventDefault();
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      console.log(data);
      alert("User registered, please login");
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError(err.response.data);
      setName("");
      setEmail("");
      setPassword("");
    }
  }

  return (
    <form className={styles.registerContainer} onSubmit={registerUser}>
      {error ? <h2>{error.message}</h2> : null}
      <div>
        <label htmlFor="name">Enter your name: </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          required
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
        />
      </div>
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
        <button type="submit">Register</button>
      </div>
    </form>
  );
}

export default Register;
