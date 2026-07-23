import { useNavigate } from "react-router-dom";

function PostCard({ post }) {
  const navigate = useNavigate();

  return (
    <article className="postCard" onClick={() => navigate(`/blog/${post.id}`)}>
      <div className="profile_details">
        <img
          src={
            post.profile_picture
              ? `http://localhost:5000/uploads${post.profile_picture}`
              : null
          }
          alt=""
          className="profile_pic"
        />
        <span>{post.author_name}</span>
        <span className="created_at">
          {new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(post.created_at))}
        </span>
      </div>
      <h2>{post.title}</h2>
      <p className="post_content">{post.content}</p>
    </article>
  );
}

export default PostCard;
