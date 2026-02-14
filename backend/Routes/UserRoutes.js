const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");
const { getMe,updateMe} = require("../Controllers/UserController");

// GET logged-in user info
router.get("/me", authMiddleware, getMe);
// PUT logged-in user info
router.put("/me", authMiddleware, updateMe);
module.exports = router;
