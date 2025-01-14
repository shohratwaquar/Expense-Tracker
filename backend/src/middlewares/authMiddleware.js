const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("error found");
    return res.status(403).json({ message: "Invalid token. Please log in." });
  }
};

module.exports = {
  authMiddleware,
};
