const jwt = require("jsonwebtoken");
const generateAccessToken = require("../services/token/generateAccessToken");

const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;

  const sendAccessDenied = (message = "Access Denied") => {
    return res.status(403).json({ message, success: false });
  };

  const attemptTokenRefresh = () => {
    if (!refreshToken) return sendAccessDenied("No refresh token available");

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        console.error("Invalid refresh token", err.message);
        res.clearCookie("authToken"); // Clear invalid tokens
        res.clearCookie("refreshToken");
        return sendAccessDenied("Invalid refresh token");
      }

      const newAccessToken = generateAccessToken(user);
      res.cookie("authToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 5 * 60 * 1000, // 5 minutes
      });

      jwt.verify(newAccessToken, process.env.JWT_SECRET, (err, verifiedUser) => {
        if (err) {
          console.error("Error verifying new access token", err.message);
          return sendAccessDenied("Error verifying access token");
        }
        req.user = verifiedUser;
        next();
      });
    });
  };

  if (!accessToken) {
    console.log("No access token, attempting to refresh...");
    return attemptTokenRefresh();
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log("Access token expired. Attempting to refresh...");
        return attemptTokenRefresh();
      }
      console.log("Invalid access token.", err.message);
      return sendAccessDenied("Invalid access token");
    }

    req.user = user;
    next();
  });
};

module.exports = verifyToken;
