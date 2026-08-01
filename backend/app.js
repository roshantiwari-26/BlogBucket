require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () =>
  console.log(`App server is running on PORT ${PORT}`),
);
