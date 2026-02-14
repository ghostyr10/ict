exports.mockPayment = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Payment successful",
      paymentId: "PAY_" + Date.now(),
    });
  } catch (error) {
    res.status(500).json({ message: "Payment failed" });
  }
};
