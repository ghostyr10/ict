const UserModel = require("../Models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* ===================== SIGNUP ===================== */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: 'User already exists',
        success: false
      });
    }

    const userModel = new UserModel({
      name,
      email,
      password,
      isAdmin: false // ✅ default (VERY IMPORTANT)
    });

    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();

    res.status(201).json({
      message: 'Signup success',
      success: true
    });

  } catch (err) {
    res.status(500).json({
      message: 'Signup failed',
      success: false
    });
  }
};

/* ===================== LOGIN ===================== */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    const errorMsg = 'Email or password incorrect';

    if (!user) {
      return res.status(403).json({
        message: errorMsg,
        success: false
      });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        message: errorMsg,
        success: false
      });
    }

    // ✅🔥 MAIN FIX IS HERE
    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
      
        isAdmin: user.isAdmin // 👈 THIS LINE FIXES ADMIN ACCESS
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: "Login success",
      success: true,
      jwtToken,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin
    });

  } catch (err) {
    res.status(500).json({
      message: 'Login failed',
      success: false
    });
  }
};

module.exports = {
  signup,
  login
};
