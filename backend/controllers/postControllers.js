const pool = require("../config/db");
const AppError = require("../config/AppError");

const getAllPosts = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT p.id, p.title, p.content, p.featured_image,p.created_at, u.name AS author_name, u.profile_picture, c.category_name FROM posts p JOIN users u ON p.author_id=u.id JOIN categories c ON p.category_id=c.id ORDER BY p.created_at DESC;",
    );
    return res.json(rows);
  } catch (err) {
    next(err);
  }
};

const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const [rows] = await pool.query(
      "SELECT p.id, p.title, p.content, p.created_at, p.updated_at, p.featured_image, u.name AS author_name, u.profile_picture, c.category_name (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.id ) AS totalLikes, (SELECT COUNT(*) FROM comments cm WHERE cm.post_id=p.id ) AS totalComments FROM posts p JOIN users u ON p.author_id=u.id JOIN categories c ON p.category_id=c.id WHERE p.id=?",
      [postId],
    );
    if (rows.length === 0) {
      throw new AppError("Post not found", 404);
    }
    return res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const [post] = await pool.query("SELECT 1 FROM posts WHERE id=?", [postId]);
    if (post.length === 0) {
      throw new AppError("Post not found", 404);
    }
    const [comments] = await pool.query(
      "SELECT c.id, c.comment, c.created_at, u.name AS author_name FROM comments c JOIN users u On c.user_id=u.id WHERE c.post_id=? ORDER BY c.created_at ASC",
      [postId],
    );
    return res.json({ totalComments: comments.length, comments });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  getAllPosts,
  getPost,
  getComments,
};
