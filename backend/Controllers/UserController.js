const User = require("../Models/User");

// Get current logged-in user info
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name email isBanned isSuspended role"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Update logged-in user info
exports.updateMe = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err });
  }
};
