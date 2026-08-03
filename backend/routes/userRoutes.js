const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const profileUpload = require("../utils/profileUpload");
const coverUpload = require("../utils/coverUpload");
const {
  getUser,
  getUserPosts,
  updatePost,
  createPost,
  deletePost,
  createComment,
  setLike,
  setProfilePic,
  setCoverImage,
  getLikeStatus,
} = require("../controllers/userControllers");
const pool = require("../config/db");

router.get("/me", authMiddleware, getUser);
router.get("/posts", authMiddleware, getUserPosts);
router.post(
  "/posts",
  authMiddleware,
  coverUpload.single("featuredImage"),
  createPost,
);
router.put(
  "/posts/:id",
  authMiddleware,
  coverUpload.single("featuredImage"),
  updatePost,
);
router.delete("/posts/:id", authMiddleware, deletePost);
router.post("/posts/:id/comments", authMiddleware, createComment);
router.post("/posts/:id/like", authMiddleware, setLike);
router.get("/posts/:id/like-status", authMiddleware, getLikeStatus);
router.put(
  "/profile-picture",
  authMiddleware,
  profileUpload.single("profile_pic"),
  setProfilePic,
);
router.put(
  "/posts/:id/cover-image",
  authMiddleware,
  coverUpload.single("featuredImage"),
  setCoverImage,
);

router.get("/categories", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, category_name FROM categories ORDER BY category_name ASC",
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching categories.",
    });
  }
});

module.exports = router;
