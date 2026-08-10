import { useNavigate } from "react-router-dom";
import styles from "./PostCard.module.css";

function PostCard({ post }) {
  const navigate = useNavigate();

  function getTextSnippet(html, length = 100) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = (doc.body.textContent || "").replace(/\s+/g, " ").trim();

    if (!text) return "No content snippet available.";

    return text.length > length ? text.substring(0, length) + "..." : text;
  }

  return (
    <article className={styles.card}>
      <div className={styles.cardImageWrapper}>
        <img
          src={
            post.featured_image
              ? `https://blogbucket-api.onrender.com/uploads${post.featured_image}`
              : "https://via.placeholder.com/400x200?text=No+Image"
          }
          alt={post.title}
          className={styles.cardImage}
          onClick={() => navigate(`/blog/${post.id}`)}
        />
        {post.category_name && (
          <span className={styles.categoryBadge}>{post.category_name}</span>
        )}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{post.title}</h3>
        <p className={styles.cardSnippet}>
          {post.content
            ? getTextSnippet(post.content)
            : "No content snippet available."}
        </p>

        <div className={styles.cardFooter}>
          <span>{post.author_name}</span>
          <span className={styles.postDate}>
            {new Intl.DateTimeFormat("en-IN").format(new Date(post.created_at))}
          </span>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
