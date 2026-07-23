import React, { useState, useEffect } from "react";
import styles from "./CreatePost.module.css";
import api from "../services/api";

function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    category: 9,
    content: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/user/categories");
        const fetchedCategories = data;
        console.log(fetchedCategories);
        setCategories(fetchedCategories);

        if (fetchedCategories.length > 0) {
          const defaultCategory = fetchedCategories[0].id;
          setFormData((prev) => ({
            ...prev,
            category: defaultCategory,
          }));
        }
      } catch (error) {
        console.error("Error fetching categories from MySQL:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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

      const { data } = await api.post("/user/posts", dataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server Response:", data);
      alert("Post created successfully!");

      setFormData({ title: "", category: "tech", content: "" });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.response?.data?.message || "Failed to create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Create New Blog Post</h2>

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
              placeholder="Enter an engaging post title..."
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
              disabled={loadingCategories}
            >
              {loadingCategories ? (
                <option value="">Loading categories...</option>
              ) : categories.length === 0 ? (
                <option value="">No categories available</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))
              )}
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

            {imagePreview && (
              <div className={styles.previewContainer}>
                <p className={styles.previewText}>Preview:</p>
                <img
                  src={imagePreview}
                  alt="Featured Preview"
                  className={styles.previewImage}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${styles.button} ${isSubmitting ? styles.buttonDisabled : ""}`}
          >
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
