const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../config/AppError");
const registerScheme = require("../validation/registerValidation");
const loginSchema = require("../validation/loginValidation");
const register = async (req, res, next) => {
  try {
    const { error, value } = registerScheme.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 422);
    }
    const data = value;

    const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [
      data.email,
    ]);

    if (rows.length > 0) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await pool.query(
      " INSERT INTO users(name, email, password) VALUES (?,?,?)",
      [data.name, data.email, hashedPassword],
    );
    return res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 422);
    }
    const data = value;
    const [user] = await pool.query("SELECT * FROM users WHERE email=?", [
      data.email,
    ]);
    if (user.length === 0) {
      throw new AppError("Invalid credentials", 401);
    }
    const isMatched = await bcrypt.compare(data.password, user[0].password);
    if (!isMatched) {
      throw new AppError("Invalid credentials", 401);
    }
    const accessToken = jwt.sign(
      { id: user[0].id, role: user[0].role, name: user[0].name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
        issuer: "BlogBucket",
      },
    );
    await pool.query(
      "UPDATE users SET last_login=CURRENT_TIMESTAMP WHERE id=?",
      [user[0].id],
    );
    const { password, ...userData } = user[0];
    return res.json({
      message: "Login successful",
      user: userData,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};
