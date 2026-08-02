import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./EditPost.module.css";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const catRes = await api.get("/user/categories");
        const fetchedCategories = catRes.data;
        setCategories(fetchedCategories);

        const postRes = await api.get(`/post/posts/${id}`);
        const post = postRes.data;

        setFormData({
          title: post.title || "",
          category: post.category_id || "",
          content: post.content || "",
        });

        if (post.featured_image) {
          setExistingImageUrl(post.featured_image);
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
        alert("Failed to load post data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append("title", formData.title);
      dataToSubmit.append("category", formData.category);
      dataToSubmit.append("content", formData.content);

      if (imageFile) {
        dataToSubmit.append("featuredImage", imageFile);
      }

      await api.put(`/user/posts/${id}`, dataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating post:", error);
      alert(error.response?.data?.message || "Failed to update post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading Post Data...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Edit Blog Post</h2>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <div className={styles.mainSection}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Post Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title..."
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>
              Blog Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              required
              className={styles.textarea}
            />
          </div>
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option
                  key={cat.id || cat.category_id}
                  value={cat.id || cat.category_id}
                >
                  {cat.category_name || cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="featuredImage" className={styles.label}>
              Featured Image
            </label>
            <input
              type="file"
              id="featuredImage"
              name="featuredImage"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />

            <div className={styles.previewContainer}>
              {imagePreview ? (
                <>
                  <p className={styles.previewText}>New Image Selected:</p>
                  <img
                    src={imagePreview}
                    alt="New Preview"
                    className={styles.previewImage}
                  />
                </>
              ) : existingImageUrl ? (
                <>
                  <p className={styles.previewText}>Current Image:</p>
                  <img
                    src={
                      existingImageUrl.startsWith("http")
                        ? existingImageUrl
                        : `https://blogbucket-api.onrender.com/uploads/${existingImageUrl}`
                    }
                    alt="Current Featured"
                    className={styles.previewImage}
                  />
                </>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${styles.button} ${
              isSubmitting ? styles.buttonDisabled : ""
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;
