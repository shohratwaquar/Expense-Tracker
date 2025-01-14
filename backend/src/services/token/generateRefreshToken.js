const jwt = require('jsonwebtoken');

const generateRefreshToken = async (data) =>{
    const token = await jwt.sign(
        data,
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: "7d",
        }
      )
      return token;
}

module.exports = generateRefreshToken;