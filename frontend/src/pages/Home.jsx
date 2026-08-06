import { useState } from "react";
import api from "../services/api";
import { useEffect } from "react";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";

import styles from "./Home.module.css";
function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    async function fetchPosts() {
      try {
        const { data } = await api.get("/post/posts", {
          signal: controller.signal,
        });
        console.log(data);
        setPosts(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
    return () => controller.abort();
  }, []);
  return (
    <main className={styles.homePage}>
      {loading ? (
        <Loader />
      ) : (
        posts.map((val) => <PostCard key={val.id} post={val} />)
      )}
    </main>
  );
}

export default Home;
