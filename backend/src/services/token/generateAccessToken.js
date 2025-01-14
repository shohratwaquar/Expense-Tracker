const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const payload = { ...user };
  delete payload.exp;

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

module.exports = generateAccessToken;