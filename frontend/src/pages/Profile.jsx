import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import styles from "./Profile.module.css";
import avatar from "../../public/avatar.svg";

function Profile() {
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        if (user.role === "admin") {
          const response = await api.get("/post/posts");
          setPosts(response.data);
        } else {
          const response = await api.get("/user/posts");
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const handleDeletePost = async (postId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this blog post? This action cannot be undone.",
    );

    if (!isConfirmed) return;

    try {
      setDeletingId(postId);
      await api.delete(`/user/posts/${postId}`);

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      alert("Blog post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.response?.data?.message || "Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  async function handleProfileUpload(e) {
    const file = e.target.files[0];

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_pic", file);
    try {
      await api.put("/user/profile-picture", formData);

      alert("Profile picture updated successfully!");

      window.location.reload();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Upload failed");
    }
  }

  if (!user) {
    return (
      <div className={styles.loading}>Please log in to view your profile.</div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarWrapper}>
          <img
            src={
              user.profile_picture
                ? user.profile_picture.startsWith("http")
                  ? user.profile_picture
                  : `https://blogbucket-api.onrender.com/uploads${user.profile_picture}`
                : avatar
            }
            alt={user.name}
            className={styles.avatar}
          />
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleProfileUpload}
          />
          <button
            type="button"
            className={styles.changePhotoBtn}
            onClick={() => fileInputRef.current.click()}
          >
            📷 Change Profile Picture
          </button>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.nameRow}>
            <h1 className={styles.userName}>{user.name}</h1>
            <span
              className={`${styles.roleBadge} ${
                user.role === "admin" ? styles.adminBadge : styles.userBadge
              }`}
            >
              {user.role}
            </span>
          </div>
          <p className={styles.userEmail}>{user.email}</p>

          <div className={styles.stats}>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>{posts.length}</span>
              <span className={styles.statLabel}>
                {user.role === "admin"
                  ? "Total Blogs Managed"
                  : "Blogs Published"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.postsSection}>
        <h2 className={styles.sectionTitle}>
          {user.role === "admin" ? "All Managed Blogs" : "My Published Blogs"}
        </h2>

        {loading ? (
          <div className={styles.loading}>Loading blogs...</div>
        ) : posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You haven't created any blog posts yet.</p>
            <button
              onClick={() => navigate("/create-post")}
              className={styles.createBtn}
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {posts.map((post) => (
              <div key={post.id} className={styles.card}>
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
                    <span className={styles.categoryBadge}>
                      {post.category_name}
                    </span>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardSnippet}>
                    {post.content
                      ? post.content.substring(0, 100) + "..."
                      : "No content snippet available."}
                  </p>

                  <div className={styles.cardFooter}>
                    <span className={styles.postDate}>
                      {new Intl.DateTimeFormat("en-IN").format(
                        new Date(post.created_at),
                      )}
                    </span>

                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => navigate(`/edit-post/${post.id}`)}
                        className={styles.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deletingId === post.id}
                        className={styles.deleteBtn}
                      >
                        {deletingId === post.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
