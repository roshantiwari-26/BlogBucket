import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import styles from "./FullBlog.module.css";

import DOMPurify from "dompurify";
import { AuthContext } from "../context/AuthContext";

function Blog() {
  const [fullBlog, setFullBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);

  const { user } = useContext(AuthContext);

  const { id } = useParams();
  useEffect(() => {
    const controller = new AbortController();
    getFullBlog(controller.signal);
    getComments(controller.signal);
    getLikeStatus();
    return () => controller.abort();
  }, [id]);

  async function getFullBlog(signal) {
    try {
      const { data } = await api.get(`/post/posts/${id}`, {
        signal,
      });
      setFullBlog(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getComments(signal) {
    try {
      const { data } = await api.get(`/post/posts/${id}/comments`, {
        signal,
      });
      setComments(data.comments);
    } catch (err) {
      console.log(err);
    }
  }

  async function getLikeStatus() {
    try {
      const { data } = await api.get(`/user/posts/${id}/like-status`);
      setLiked(data.liked);
    } catch (err) {
      setLiked(false);
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      await api.post(`/user/posts/${id}/comments`, {
        comment,
      });

      setComment("");
      await getComments();
    } catch (err) {
      console.log(err);
    }
  }

  async function handleLike() {
    try {
      await api.post(`/user/posts/${id}/like`);
      await getFullBlog();
      await getLikeStatus();
    } catch (err) {
      console.log(err);
    }
  }

  return fullBlog ? (
    <main className={styles.fullBlogContainer}>
      <div className={styles.profile_details}>
        <img
          src={
            fullBlog.profile_picture
              ? `https://blogbucket-api.onrender.com/uploads${fullBlog.profile_picture}`
              : null
          }
          alt=""
          className={styles.profile_pic}
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
      <p className={styles.created_at}>
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
          className={styles.featured_image}
        />
      ) : null}
      <h1>{fullBlog.title}</h1>
      <div className={styles.post_stats}>
        <button
          className={liked ? styles.liked_button : styles.like_button}
          onClick={user ? handleLike : alert("Please login/register to like")}
        >
          ❤️ {fullBlog.totalLikes} Likes
        </button>
        <span>💬 {comments.length || 0} Comments</span>
      </div>
      <div
        className={styles.post_content}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(fullBlog.content),
        }}
      />

      <hr />

      <form onSubmit={handleCommentSubmit} className={styles.comment_form}>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
        />

        <button type="submit" disabled={!comment.trim()}>
          Post Comment
        </button>
      </form>

      <hr />

      <h3>Comments ({comments.length})</h3>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className={styles.comment_card}>
            <strong>{comment.author_name}</strong>
            <small>
              {new Intl.DateTimeFormat("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date(comment.created_at))}
            </small>
            <p>{comment.comment}</p>
          </div>
        ))
      )}
    </main>
  ) : (
    <h2>Loading...</h2>
  );
}

export default Blog;
