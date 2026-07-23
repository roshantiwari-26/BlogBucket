import { useState, createContext } from "react";
import api from "../services/api";
import { useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken"),
  );
  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await api.get("/user/me");
        console.log(data);
        setUser(data);
      } catch (err) {
        console.log(err);
        localStorage.removeItem("accessToken");
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    }
    if (accessToken) getUser();
    else setLoading(false);
  }, [accessToken]);

  function logout() {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  }

  function login(user, accessToken) {
    setUser(user);
    setAccessToken(accessToken);
    localStorage.setItem("accessToken", accessToken);
  }

  return (
    <AuthContext.Provider value={{ user, logout, login, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
