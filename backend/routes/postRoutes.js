const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllPosts,
  getPost,
  createComment,
  getComments,
  setLike,
} = require("../controllers/postControllers");

router.get("/posts", getAllPosts);
router.get("/posts/:id", getPost);
router.get("/posts/:id/comments", getComments);

module.exports = router;
