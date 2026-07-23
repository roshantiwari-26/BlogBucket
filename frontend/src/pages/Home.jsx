import { useState } from "react";
import api from "../services/api";
import { useEffect } from "react";
import PostCard from "../components/PostCard";
function Home() {
  const [posts, setPosts] = useState([]);
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
      }
    }
    fetchPosts();
    return () => controller.abort();
  }, []);
  return (
    <main>
      {posts.map((val) => (
        <PostCard key={val.id} post={val} />
      ))}
    </main>
  );
}

export default Home;
