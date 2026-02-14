const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");
const { mockPayment } = require("../Controllers/PaymentController");

router.post("/pay", authMiddleware, mockPayment);

module.exports = router;
