const express = require("express");
const router = express.Router();
const {
  requestRegisteration,
  verifyRegisteration,
  login,
} = require("../controllers/authControllers");

router.post("/register-request", requestRegisteration);
router.post("/register-verify", verifyRegisteration);
router.post("/login", login);

router.post("/request-otp");

module.exports = router;
