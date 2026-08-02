import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Blog() {
  const [fullBlog, setFullBlog] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const controller = new AbortController();
    async function getFullBlog() {
      try {
        const { data } = await api.get(`/post/posts/${id}`, {
          signal: controller.signal,
        });
        console.log(data);
        setFullBlog(data);
      } catch (err) {
        console.log(err);
        return (
          <main>
            <h2>{err.message}</h2>
          </main>
        );
      }
    }

    getFullBlog();
    return () => controller.abort();
  }, [id]);

  return fullBlog ? (
    <main className="fullBlogContainer">
      <div className="profile_details">
        <img
          src={
            fullBlog.profile_picture
              ? `https://blogbucket-api.onrender.com/uploads${fullBlog.profile_picture}`
              : null
          }
          alt=""
          className="profile_pic"
        />
        <span>{fullBlog.author_name}</span>
        {" | "}
        <span>
          {new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(fullBlog.created_at))}
        </span>
      </div>
      <p className="created_at">
        Last updated on:{" "}
        {new Intl.DateTimeFormat("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(fullBlog.updated_at))}
      </p>
      {fullBlog.featured_image ? (
        <img
          src={`https://blogbucket-api.onrender.com/uploads${fullBlog.featured_image}`}
          alt=""
          className="featured_image"
        />
      ) : null}
      <h1>{fullBlog.title}</h1>
      <p className="post_content">{fullBlog.content}</p>
    </main>
  ) : (
    <h2>Loading...</h2>
  );
}

export default Blog;
