const pool = require("../config/db");
const postSchema = require("../validation/postValidation");
const commentSchema = require("../validation/commentValidation");
const AppError = require("../config/AppError");
const fs = require("fs/promises");
const path = require("path");

const getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      "SELECT id, name, email, role, profile_picture, is_verified FROM users WHERE id=?",
      [userId],
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      "SELECT p.id, p.title, p.content,p.featured_image, p.created_at, u.name AS author_name, u.profile_picture, c.category_name FROM posts p JOIN users u ON p.author_id=u.id JOIN categories c ON p.category_id=c.id WHERE u.id=?",
      [userId],
    );
    if (rows.length === 0) {
      throw new AppError("No post found", 404);
    }
    return res.json(rows);
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const postId = req.params.id;

    const { error, value } = postSchema.validate(req.body);
    if (error) {
      if (req.file) {
        await fs
          .unlink(req.file.path)
          .catch((err) => console.error("File deletion error:", err));
      }
      throw new AppError(error.details[0].message, 422);
    }

    const data = value;
    const newImagePath = req.file ? "/posts/" + req.file.filename : undefined;

    const [rows] = await pool.query(
      "SELECT author_id, featured_image FROM posts WHERE id = ?",
      [postId],
    );

    if (rows.length === 0) {
      if (req.file) {
        await fs
          .unlink(req.file.path)
          .catch((err) => console.error("File deletion error:", err));
      }
      throw new AppError("No post found", 404);
    }

    const existingPost = rows[0];

    if (existingPost.author_id === userId || userRole === "admin") {
      if (newImagePath) {
        await pool.query(
          `UPDATE posts 
           SET title = ?, category_id = ?, content = ?, featured_image = ?, updated_at = CURRENT_TIMESTAMP 
           WHERE id = ?`,
          [data.title, data.category, data.content, newImagePath, postId],
        );

        if (existingPost.featured_image) {
          const oldFilePath = path.join(
            process.cwd(),
            "uploads",
            existingPost.featured_image,
          );
          await fs.unlink(oldFilePath).catch((err) => {
            console.error("Failed to delete old image:", err.message);
          });
        }
      } else {
        await pool.query(
          `UPDATE posts 
           SET title = ?, category_id = ?, content = ?, updated_at = CURRENT_TIMESTAMP 
           WHERE id = ?`,
          [data.title, data.category, data.content, postId],
        );
      }

      console.log("Post updated successfully");
      return res.status(200).json({
        success: true,
        message: "Post updated successfully",
      });
    } else {
      if (req.file) {
        await fs
          .unlink(req.file.path)
          .catch((err) => console.error("File deletion error:", err));
      }
      throw new AppError("Unauthorized access to update this post", 403);
    }
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
  try {
    console.log(req.body);
    const { error, value } = postSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);
    const data = value;
    const userId = req.user.id;
    const imagePath = "/posts/" + req.file.filename;
    const [result] = await pool.query(
      "INSERT INTO posts(title, content, author_id, category_id, featured_image) VALUES (?,?,?,?,?)",
      [data.title, data.content, userId, data.category, imagePath],
    );
    return res.status(201).json({
      message: "Post created successfully",
      postId: result.insertId,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const postId = req.params.id;

    const [rows] = await pool.query(
      "SELECT author_id, featured_image FROM posts WHERE id=?",
      [postId],
    );

    if (rows.length === 0) {
      throw new AppError("No post found", 404);
    }

    if (rows[0].author_id === userId || userRole === "admin") {
      await pool.query("DELETE FROM comments WHERE post_id=?", [postId]);

      await pool.query("DELETE FROM likes WHERE post_id=?", [postId]);

      if (rows[0].featured_image) {
        try {
          const imagePath = path.join(
            __dirname,
            "..",
            "uploads",
            rows[0].featured_image.replace(/^\//, ""),
          );

          await fs.unlink(imagePath);
        } catch (err) {
          console.log("Featured image not found.");
        }
      }

      await pool.query("DELETE FROM posts WHERE id=?", [postId]);

      return res.json({ message: "Post deleted successfully" });
    } else {
      throw new AppError("Unauthorized", 403);
    }
  } catch (err) {
    next(err);
  }
};

const createComment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { error, value } = commentSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);
    const data = value;
    const [rows] = await pool.query("SELECT 1 FROM posts WHERE id=?", [postId]);
    if (rows.length === 0) {
      throw new AppError("No post found", 404);
    }
    const [result] = await pool.query(
      "INSERT INTO comments(comment, user_id, post_id) VALUES(?,?,?)",
      [data.comment, userId, postId],
    );

    return res
      .status(201)
      .json({ message: "Commented successfully", commentId: result.insertId });
  } catch (err) {
    next(err);
  }
};

const setLike = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const [post] = await pool.query("SELECT 1 FROM posts WHERE id=?;", [
      postId,
    ]);
    if (post.length === 0) {
      throw new AppError("No post found", 404);
    }
    const [like] = await pool.query(
      "SELECT 1 FROM likes WHERE user_id=? AND post_id=?",
      [userId, postId],
    );
    if (like.length === 0) {
      const [result] = await pool.query(
        "INSERT INTO likes(user_id, post_id) VALUES(?,?)",
        [userId, postId],
      );
      return res
        .status(201)
        .json({ message: "Post liked", likedId: result.insertId });
    } else {
      await pool.query("DELETE FROM likes WHERE user_id=? AND post_id=?", [
        userId,
        postId,
      ]);
      return res.json({ message: "Post unliked" });
    }
  } catch (err) {
    next(err);
  }
};

const getLikeStatus = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT 1 FROM likes WHERE user_id=? AND post_id=?",
      [userId, postId],
    );

    return res.json({
      liked: rows.length > 0,
    });
  } catch (err) {
    next(err);
  }
};

const setProfilePic = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!req.file) throw new AppError("Profile picture field is empty", 400);
    await pool.query("UPDATE users SET profile_picture=? WHERE id=?", [
      "/profiles/" + req.file.filename,
      userId,
    ]);
    return res.json({ message: "Profile picture uploaded" });
  } catch (err) {
    next(err);
  }
};

const setCoverImage = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const [post] = await pool.query(
      "SELECT 1 FROM posts WHERE id=? AND author_id=?",
      [postId, userId],
    );
    if (post.length === 0) {
      throw new AppError("Post does not exists", 404);
    }
    if (!req.file) throw new AppError("Cover image field is empty", 400);
    await pool.query(
      "UPDATE posts SET featured_image=? WHERE id=? AND author_id=?",
      ["/posts/" + req.file.filename, postId, userId],
    );
    return res.json({ message: "Cover image updated successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUser,
  getUserPosts,
  updatePost,
  createPost,
  deletePost,
  createComment,
  setLike,
  getLikeStatus,
  setProfilePic,
  setCoverImage,
};
