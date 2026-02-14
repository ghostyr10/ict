const adminMiddleware = (req, res, next) => {
  console.log("ADMIN MIDDLEWARE req.user =", req.user);

  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({
      message: "Access denied: not an admin",
      user: req.user,
    });
  }

  next();
};

module.exports = adminMiddleware;
