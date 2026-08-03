import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Blog() {
  const [fullBlog, setFullBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const { id } = useParams();
  useEffect(() => {
    const controller = new AbortController();
    async function getFullBlog() {
      try {
        const { data } = await api.get(`/post/posts/${id}`, {
          signal: controller.signal,
        });
        setFullBlog(data);
      } catch (err) {
        console.log(err);
      }
    }

    getFullBlog();
    getComments();
    return () => controller.abort();
  }, [id]);

  async function getComments() {
    try {
      const { data } = await api.get(`/post/posts/${id}/comments`);
      setComments(data.comments);
    } catch (err) {
      console.log(err);
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
      <div className="post_stats">
        <span>❤️ {fullBlog.totalLikes || 0} Likes</span>
        <span>💬 {comments.length || 0} Comments</span>
      </div>
      <p className="post_content">{fullBlog.content}</p>

      <hr />

      <form onSubmit={handleCommentSubmit} className="comment_form">
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
          <div key={comment.id} className="comment_card">
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
